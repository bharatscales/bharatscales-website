// BHARATSCALES — Blog listing page (3 featured cards)

(function () {
  const grid = document.getElementById('blogsGrid');
  if (!grid) return;

  const FEATURED_SLUGS = [
    'predictive-maintenance-software-guide',
    'firefighting-to-foresight',
    'smart-factory-roadmap-2026',
  ];

  const blogs = FEATURED_SLUGS
    .map(slug => {
      const blog = (window.BLOGS || {})[slug];
      return blog ? { slug, ...blog } : null;
    })
    .filter(Boolean);

  if (!blogs.length) {
    grid.innerHTML = '<p class="section-desc">No blog posts yet. Check back soon.</p>';
    return;
  }

  blogs.forEach(blog => {
    const card = document.createElement('article');
    card.className = 'resource-card';

    const media = document.createElement('div');
    media.className = 'resource-media';
    media.style.backgroundImage = `url("${blog.image}")`;
    card.appendChild(media);

    const body = document.createElement('div');
    body.className = 'resource-body';

    const type = document.createElement('span');
    type.className = 'resource-type';
    type.textContent = blog.type;
    body.appendChild(type);

    const title = document.createElement('h3');
    title.textContent = blog.title;
    body.appendChild(title);

    if (blog.excerpt) {
      const excerpt = document.createElement('p');
      excerpt.className = 'blog-card-excerpt';
      excerpt.textContent = blog.excerpt;
      body.appendChild(excerpt);
    }

    const metaParts = [blog.date, blog.readTime].filter(Boolean);
    if (metaParts.length) {
      const meta = document.createElement('p');
      meta.className = 'blog-card-meta';
      meta.textContent = metaParts.join('  ·  ');
      body.appendChild(meta);
    }

    const link = document.createElement('a');
    link.className = 'link-arrow';
    link.href = `blog.html?slug=${blog.slug}`;
    link.textContent = 'Read more →';
    body.appendChild(link);

    card.appendChild(body);
    grid.appendChild(card);
  });
})();
