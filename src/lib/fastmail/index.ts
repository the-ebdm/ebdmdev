const allCaps = [
  "urn:ietf:params:jmap:core",
  "urn:ietf:params:jmap:mail",
  "urn:ietf:params:jmap:submission"
]

const defaultCaps = [
  "urn:ietf:params:jmap:core",
  "urn:ietf:params:jmap:mail",
]

interface Email {
  id: string;
  subject: string;
  from: { name: string | null, email: string }[];
  to: { name: string | null, email: string }[];
  receivedAt: string;
  isUnread: boolean;
  inReplyTo: string | null;
  references: string[] | null;
  sender: { name: string | null, email: string } | null;
  cc: { name: string | null, email: string }[] | null;
  bcc: { name: string | null, email: string }[] | null;
  replyTo: { name: string | null, email: string }[];
  sentAt: string;
  htmlBody: { type: string, value: string }[];
  bodyValues: { [key: string]: string };
  blobId: string;
  messageId: string[];
}

interface Mailbox {
  id: string;
  name: string;
  parentId: string | null;
  role: string | null;
  sortOrder: number;
  totalEmails: number;
  unreadEmails: number;
  children: Mailbox[];
}

const defaultProperties = [
  "id",
  "subject",
  "from",
  "to",
  "receivedAt",
  "blobId",
  "messageId",
  "inReplyTo",
  "references",
  "sender",
  "cc",
  "bcc",
  "replyTo",
  "sentAt",
  "htmlBody",
  "bodyValues"
]

class FastmailClient {
  hostname: string;
  token: string;
  apiUrl: string;
  authUrl: string;
  username: string;
  session: any;
  accountId: string | null;
  mailboxId: string | null;
  identityId: string | null;
  headers: HeadersInit;

  constructor({ hostname, token, username, apiUrl }: {
    hostname: string,
    token: string,
    username: string,
    apiUrl: string
  }) {
    this.hostname = hostname;
    this.username = username;
    this.token = token;
    this.apiUrl = apiUrl;
    this.authUrl = `https://${hostname}/.well-known/jmap`;
    this.accountId = null;
    this.mailboxId = null;
    this.identityId = null;
    this.headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  getSession = async () => {
    const response = await fetch(this.authUrl, {
      method: "GET",
      headers: this.headers,
    });
    const session = await response.json();
    this.session = session;
    this.apiUrl = session.apiUrl;
    this.accountId = session.primaryAccounts["urn:ietf:params:jmap:mail"];

    return this;
  }

  getMailboxes = async (parse: boolean = true) => {
    const response = await fetch(this.apiUrl, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({
        using: ["urn:ietf:params:jmap:core", "urn:ietf:params:jmap:mail"],
        methodCalls: [["Mailbox/get", { accountId: this.accountId, ids: null }, "a"]],
      }),
    });
    const data = await response.json();
    if (parse) {
      const topLevelMailboxes = data["methodResponses"][0][1].list.filter(
        (mailbox: Mailbox) => {
          return mailbox.parentId === null;
        }
      )
      // Add children to each mailbox
      topLevelMailboxes.forEach((mailbox: Mailbox) => {
        mailbox.children = data["methodResponses"][0][1].list.filter(
          (child: Mailbox) => child.parentId === mailbox.id
        )
      });
      return topLevelMailboxes;
    }
    return data["methodResponses"][0][1].list;
  };

  selectMailbox = async (name: string) => {
    const response = await fetch(this.apiUrl, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({
        using: [
          "urn:ietf:params:jmap:core",
          "urn:ietf:params:jmap:mail"
        ],
        methodCalls: [
          ["Mailbox/query", { accountId: this.accountId, filter: { name } }, "a"],
        ],
      }),
    });

    const data = await response.json();
    this.mailboxId = await data["methodResponses"][0][1].ids[0];

    return this;
  };

  identityQuery = async (caps: string[] = defaultCaps) => {
    console.log(this.accountId)
    const response = await fetch(this.apiUrl, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({
        using: [
          "urn:ietf:params:jmap:core",
          "urn:ietf:params:jmap:mail",
        ],
        methodCalls: [["Identity/get", { accountId: this.accountId, ids: null }, "a"]],
      }),
    });
    if (response.status !== 200) {
      throw new Error("Error fetching identities")
    }
    const data = await response.json();

    try {
      this.identityId = await data["methodResponses"][0][1].list.filter(
        (identity: any) => identity.email === this.username
      )[0].id;
    } catch (error) {
      console.log(this.accountId)
      console.log(data["methodResponses"][0][1]);
      console.log("Error fetching identity id");
      console.log(error);
    }

    return this;
  };

  mailQuery = async (limit: number = 10, filter?: any, sort: any = [{ property: "receivedAt", isAscending: false }], properties: string[] = defaultProperties) => {
    if (filter === undefined) {
      filter = {
        inMailbox: this.mailboxId,
      }
    }
    const queryResponse = await fetch(this.apiUrl, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({
        using: ["urn:ietf:params:jmap:core", "urn:ietf:params:jmap:mail"],
        methodCalls:
          [
            [
              "Email/query",
              { accountId: this.accountId, filter, sort, limit },
              "a",
            ],
            [
              "Email/get",
              { accountId: this.accountId, properties, "#ids": { resultOf: "a", name: "Email/query", path: "/ids", }, },
              "b",
            ],
            [
              "Thread/get",
              { accountId: this.accountId, "#ids": { "name": "Email/get", "path": "/list/*/threadId", "resultOf": "b" } },
              "c"
            ],
          ],
      }),
    });

    if (queryResponse.status !== 200) {
      throw new Error("Error fetching mail")
    }

    const data = await queryResponse.json();

    return data["methodResponses"][1][1].list;
  };

  getEmail = async (ids: string[] | null, properties: any = defaultProperties) => {
    const response = await fetch(this.apiUrl, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({
        using: ["urn:ietf:params:jmap:core", "urn:ietf:params:jmap:mail"],
        methodCalls: [
          ["Email/get", { accountId: this.accountId, ids: ids, properties }, "a"],
        ],
      }),
    });

    if (response.status !== 200) {
      throw new Error("Error fetching email")
    }

    const data = await response.json();
    const email = data["methodResponses"][0][1].list;
    return email;
  };
}

export default FastmailClient;