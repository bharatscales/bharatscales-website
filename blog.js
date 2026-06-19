// BHARATSCALES — Resource/blog detail page

const blogParams = new URLSearchParams(window.location.search);
const blogSlug = blogParams.get('slug');
const blog = (window.BLOGS || {})[blogSlug];

function renderBlock(block) {
  switch (block.type) {
    case 'h2': {
      const h = document.createElement('h2');
      h.textContent = block.text;
      return h;
    }
    case 'h3': {
      const h = document.createElement('h3');
      h.textContent = block.text;
      return h;
    }
    case 'p': {
      const p = document.createElement('p');
      p.textContent = block.text;
      return p;
    }
    case 'list': {
      const ul = document.createElement('ul');
      ul.className = 'blog-list';
      block.items.forEach(text => {
        const li = document.createElement('li');
        li.textContent = text;
        ul.appendChild(li);
      });
      return ul;
    }
    case 'ol': {
      const ol = document.createElement('ol');
      ol.className = 'blog-ol';
      block.items.forEach(text => {
        const li = document.createElement('li');
        li.textContent = text;
        ol.appendChild(li);
      });
      return ol;
    }
    case 'quote': {
      const fig = document.createElement('figure');
      fig.className = 'blog-quote';
      const q = document.createElement('blockquote');
      q.textContent = block.text;
      fig.appendChild(q);
      if (block.cite) {
        const cap = document.createElement('figcaption');
        cap.textContent = block.cite;
        fig.appendChild(cap);
      }
      return fig;
    }
    case 'callout': {
      const div = document.createElement('div');
      div.className = 'blog-callout';
      if (block.label) {
        const strong = document.createElement('strong');
        strong.textContent = block.label;
        div.appendChild(strong);
      }
      const p = document.createElement('p');
      p.textContent = block.text;
      div.appendChild(p);
      return div;
    }
    case 'link': {
      const p = document.createElement('p');
      p.className = 'blog-link-wrap';
      const a = document.createElement('a');
      a.className = 'link-arrow';
      a.href = block.href;
      a.textContent = block.text;
      p.appendChild(a);
      return p;
    }
    case 'cta': {
      const div = document.createElement('div');
      div.className = 'blog-inline-cta';
      const h = document.createElement('h3');
      h.textContent = block.title;
      div.appendChild(h);
      const p = document.createElement('p');
      p.textContent = block.body;
      div.appendChild(p);
      const actions = document.createElement('div');
      actions.className = 'blog-inline-cta-actions';
      if (block.primaryHref) {
        const primary = document.createElement('a');
        primary.className = 'btn btn-primary';
        primary.href = block.primaryHref;
        primary.textContent = block.primaryText || 'Contact us';
        actions.appendChild(primary);
      }
      if (block.secondaryHref) {
        const secondary = document.createElement('a');
        secondary.className = 'btn btn-ghost';
        secondary.href = block.secondaryHref;
        secondary.textContent = block.secondaryText || 'Learn more';
        actions.appendChild(secondary);
      }
      div.appendChild(actions);
      return div;
    }
    case 'stats': {
      const wrap = document.createElement('div');
      wrap.className = 'blog-stats';
      block.items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'blog-stat';
        const num = document.createElement('span');
        num.className = 'blog-stat-num';
        num.textContent = item.num;
        const label = document.createElement('span');
        label.className = 'blog-stat-label';
        label.textContent = item.label;
        card.appendChild(num);
        card.appendChild(label);
        wrap.appendChild(card);
      });
      return wrap;
    }
    case 'faq': {
      const section = document.createElement('section');
      section.className = 'faq';
      const dl = document.createElement('dl');
      dl.className = 'faq-list';
      block.items.forEach(item => {
        const wrap = document.createElement('div');
        wrap.className = 'faq-item';
        const dt = document.createElement('dt');
        dt.textContent = item.q;
        const dd = document.createElement('dd');
        dd.textContent = item.a;
        wrap.appendChild(dt);
        wrap.appendChild(dd);
        dl.appendChild(wrap);
      });
      section.appendChild(dl);
      return section;
    }
    default:
      return document.createComment('unknown block');
  }
}

function updateMetaDescription(description) {
  if (!description) return;
  let meta = document.querySelector('meta[name="description"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'description';
    document.head.appendChild(meta);
  }
  meta.content = description;
}

function injectSchema(schema) {
  if (!schema) return;
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}

function renderBlog() {
  const body = document.getElementById('blogBody');

  if (!blog) {
    document.getElementById('blogType').textContent = 'Resource';
    document.getElementById('blogTitle').textContent = 'Resource not found';
    document.getElementById('blogExcerpt').textContent =
      'This resource may have moved or the link is invalid. Browse all resources.';
    document.querySelector('.blog-hero').style.display = 'none';
    body.innerHTML = '<p><a class="link-arrow" href="resources.html">View all resources →</a></p>';
    return;
  }

  const seoTitle = blog.seoTitle || blog.title;
  document.title = `${seoTitle} | BHARATSCALES`;
  updateMetaDescription(blog.metaDescription || blog.excerpt);
  injectSchema(blog.schema);

  document.getElementById('blogType').textContent = blog.type;
  document.getElementById('blogTitle').textContent = blog.title;
  document.getElementById('blogExcerpt').textContent = blog.excerpt;

  const metaParts = [blog.author, blog.date, blog.readTime].filter(Boolean);
  document.getElementById('blogMeta').textContent = metaParts.join('  ·  ');

  const img = document.getElementById('blogImage');
  img.src = blog.image;
  img.alt = blog.imageAlt || blog.title;

  body.innerHTML = '';
  blog.content.forEach(block => body.appendChild(renderBlock(block)));
}

renderBlog();
