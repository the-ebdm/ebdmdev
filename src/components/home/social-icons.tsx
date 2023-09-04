const socialLinks = [
  {
    link: 'https://linkedin.com/in/ebdm',
    icon: "bi:linkedin"
  },
  {
    link: 'https://github.com/the-ebdm',
    icon: "bi:github"
  },
  {
    link: 'https://instagram.com/the_ebdm',
    icon: "bi:instagram"
  },
  {
    link: 'https://twitter.com/ebdm_',
    icon: "bi:twitter"
  }
]

export default function SocialIcons() {
  return `
    <div class="text-default flex justify-between px-4 py-2">
      ${socialLinks.map(link => `
        <a href=${link.link} class="text-gray-400 hover:text-gray-600">
          <span class="iconify-inline" data-icon="${link.icon}"></span>
        </a>
      `).join('')}
    </div>
  `
}