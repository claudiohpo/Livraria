// scripts.js — navegação e acessibilidade

document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.btn[data-href]');

  // navegar ao clicar
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const href = btn.dataset.href;
      if(!href) return;
      // usa location.assign para manter histórico
      window.location.assign(href);
    });

    // suportar Enter/Space quando em foco por acessibilidade
    btn.addEventListener('keydown', (ev) => {
      if(ev.key === 'Enter' || ev.key === ' ') {
        ev.preventDefault();
        btn.click();
      }
    });
  });

  // Ajuste progressivo: exemplo de alterar o foco inicial quando for mobile
  if(window.matchMedia('(max-width:420px)').matches){
    // dá foco discreto no primeiro botão para facilitar uso em telas pequenas
    buttons[0]?.setAttribute('aria-label', 'Acesso ao portal do cliente');
  }
});