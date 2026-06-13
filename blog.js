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
    default:
      return document.createComment('unknown block');
  }
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

  document.title = `${blog.title} | BHARATSCALES`;
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
