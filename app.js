(() => {
  const progressBar = document.querySelector('#progress-bar');
  const topLink = document.querySelector('#top-link');
  const sectionIds = ['two-bears', 'forest-life', 'bear-parks', 'conservation', 'my-actions', 'quiz'];
  const navLinks = [...document.querySelectorAll('nav a')];

  const updateReading = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? window.scrollY / max : 0;
    progressBar.style.width = `${Math.min(100, Math.max(0, ratio * 100))}%`;
    topLink.classList.toggle('show', window.scrollY > 650);
  };
  updateReading();
  window.addEventListener('scroll', updateReading, { passive: true });

  const observer = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    navLinks.forEach((link) => {
      link.setAttribute('aria-current', String(link.getAttribute('href') === `#${visible.target.id}`));
    });
  }, { rootMargin: '-20% 0px -58% 0px', threshold: [0, .2, .5] });

  sectionIds.forEach((id) => {
    const section = document.getElementById(id);
    if (section) observer.observe(section);
  });

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', () => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target && target.hasAttribute('tabindex')) {
        window.setTimeout(() => target.focus({ preventScroll: true }), 450);
      }
    });
  });

  document.querySelectorAll('.quiz-item').forEach((item) => {
    const correctAnswer = item.dataset.answer;
    const feedback = item.querySelector('.feedback');
    item.querySelectorAll('button').forEach((button) => {
      button.addEventListener('click', () => {
        item.querySelectorAll('button').forEach((candidate) => {
          candidate.classList.remove('correct', 'wrong');
          candidate.removeAttribute('aria-pressed');
        });
        const isCorrect = button.dataset.choice === correctAnswer;
        button.classList.add(isCorrect ? 'correct' : 'wrong');
        button.setAttribute('aria-pressed', 'true');
        feedback.textContent = isCorrect
          ? '答對了！你已經是熊熊小博士。'
          : '再想一下喔！可以回前面的章節找線索。';
      });
    });
  });
})();
