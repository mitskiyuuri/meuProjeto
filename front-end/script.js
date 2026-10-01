const API = 'http://localhost:3000';
const token = () => localStorage.getItem('token');

function authHeaders(json = true) {
    const h = {};
    if (json) h['Content-Type'] = 'application/json';
    if (token()) h.Authorization = 'Bearer ' + token();
    return h;
}

async function api(path, opt = {}) {
    const r = await fetch(API + path, opt);
    let d = {};
    try { d = await r.json(); } catch {}
    if (!r.ok) throw new Error(d.mensagem || 'Erro na requisição');
    return d;
}

function esc(s = '') {
    return String(s).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
}

function requireLogin() {
    if (!token()) {
        alert('Faça login para continuar.');
        location.href = 'login.html';
        return false;
    }
    return true;
}

function logout() {
    localStorage.clear();
    location.href = 'index.html';
}

function carregarIcones() {
    if (!document.querySelector('script[data-ionicons]')) {
        const s = document.createElement('script');
        s.type = 'module';
        s.src = 'https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js';
        s.dataset.ionicons = 'true';
        document.head.appendChild(s);
    }
}

function renderNav() {
    carregarIcones();
    const el = document.querySelector('#nav');
    if (!el) return;

    const auth = token()
        ? '<a class="profile-link" href="perfil.html" title="Meu perfil"><ion-icon name="person-circle-outline"></ion-icon></a>'
        : '<a class="profile-link" href="login.html" title="Entrar"><ion-icon name="person-circle-outline"></ion-icon></a>';

    el.innerHTML = `
        <nav>
            <div class="nav-bar">
                <div class="logo"><a href="index.html">Doe-se</a></div>
                <ul class="nav-links">
                    <li><a href="index.html">Itens</a></li>
                    <li><a href="cadastrar-item.html">Publicar item</a></li>
                    <li><a href="faq.html">FAQ</a></li>
                </ul>
                <div class="darkLight-searchBox">
                    <div class="searchBox">
                        <div class="searchToggle">
                            <ion-icon name="search-outline" class="search"></ion-icon>
                            <ion-icon name="close-outline" class="cancel"></ion-icon>
                        </div>
                        <div class="search-field">
                            <ion-icon name="search-outline"></ion-icon>
                            <input class="nav-search-input" id="navSearch" type="search" placeholder="Pesquisar item...">
                        </div>
                    </div>
                    ${auth}
                </div>
            </div>
        </nav>`;

    const box = el.querySelector('.searchBox');
    const toggle = el.querySelector('.searchToggle');
    const input = el.querySelector('#navSearch');
    toggle.addEventListener('click', () => {
        box.classList.toggle('active');
        if (box.classList.contains('active')) setTimeout(() => input.focus(), 50);
    });
    input.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const value = input.value.trim();
            location.href = value ? `index.html?nome=${encodeURIComponent(value)}` : 'index.html';
        }
    });
}

async function carregarCategorias(selectId = 'categoria') {
    const s = document.getElementById(selectId);
    if (!s) return;
    try {
        const cats = await api('/itens/categorias');
        s.innerHTML = '<option value="">Todas as categorias</option>' + cats.map(c => `<option value="${c.id}">${esc(c.nome)}</option>`).join('');
    } catch (e) {
        s.innerHTML = '<option value="">Não foi possível carregar</option>';
    }
}

async function listar() {
    const grid = document.getElementById('lista');
    if (!grid) return;
    const p = new URLSearchParams(location.search);
    try {
        const itens = await api('/itens' + (p.toString() ? '?' + p.toString() : ''));
        grid.innerHTML = itens.length ? itens.map(i => `
            <article class="card">
                <img src="${i.imagem ? API + '/uploads/' + i.imagem : 'https://via.placeholder.com/500x300?text=Sem+imagem'}" alt="${esc(i.titulo)}">
                <h3>${esc(i.titulo)}</h3>
                <span class="status">${esc(i.status)}</span>
                <p>${esc(i.categoria || 'Sem categoria')}</p>
                <p class="small">${esc(i.cidade || '')}${i.bairro ? ' - ' + esc(i.bairro) : ''}</p>
                <a class="btn" href="item.html?id=${i.id}">Ver item</a>
            </article>`).join('') : '<p>Nenhum item encontrado.</p>';
    } catch (e) {
        grid.innerHTML = '<p class="msg error">' + esc(e.message) + '</p>';
    }
}

function filtros() {
    const f = document.getElementById('filtros');
    if (!f) return;
    const p = new URLSearchParams(location.search);
    ['nome','categoria','cidade','bairro'].forEach(k => {
        const field = f.elements[k];
        if (field && p.get(k)) field.value = p.get(k);
    });
    f.addEventListener('submit', e => {
        e.preventDefault();
        const params = new URLSearchParams();
        for (const [k,v] of new FormData(f)) if (v) params.set(k,v);
        location.href = 'index.html' + (params.toString() ? '?' + params.toString() : '');
    });
}

async function publicar() {
    const f = document.getElementById('formItem');
    if (!f) return;
    await carregarCategorias();
    f.addEventListener('submit', async e => {
        e.preventDefault();
        if (!requireLogin()) return;
        const fd = new FormData(f);
        try {
            const d = await fetch(API + '/itens', { method:'POST', headers: token() ? {Authorization:'Bearer '+token()} : {}, body:fd });
            const r = await d.json();
            if (!d.ok) throw new Error(r.mensagem || 'Erro ao publicar');
            alert('Item publicado!');
            location.href = 'item.html?id=' + r.itemId;
        } catch (err) {
            const out = document.getElementById('resultado');
            if (out) { out.textContent = err.message; out.className = 'msg error'; }
        }
    });
}

async function item() {
    const id = new URLSearchParams(location.search).get('id');
    const el = document.getElementById('item');
    if (!id || !el) return;
    try {
        const i = await api('/itens/' + id);
        el.innerHTML = `<div class="detail">
            <div class="top"><div><h1>${esc(i.titulo)}</h1><span class="status">${esc(i.status)}</span></div><a class="btn secondary" href="index.html">← Voltar</a></div>
            <img class="detail-img" src="${i.imagens?.[0]?.caminho_imagem ? API+'/uploads/'+i.imagens[0].caminho_imagem : 'https://via.placeholder.com/700x400?text=Sem+imagem'}" alt="${esc(i.titulo)}">
            <p><b>Categoria:</b> ${esc(i.categoria || '')}</p><p><b>Estado:</b> ${esc(i.estado || '')}</p><p><b>Local:</b> ${esc(i.cidade || '')} - ${esc(i.bairro || '')}</p><p><b>Doador:</b> ${esc(i.nome_doador || '')}</p><p>${esc(i.descricao || '')}</p>
            ${token()?`<button class="btn" onclick="solicitar(${i.id})">Tenho interesse</button>`:''}
            <div id="acoes"></div><hr style="margin:25px 0"><h2>Perguntas e respostas</h2><div id="comentarios"></div>
            ${token()?`<form id="formComentario" class="form"><textarea class="input" name="comentario" placeholder="Faça uma pergunta ou comentário" required></textarea><button class="btn">Publicar</button></form>`:'<p class="small">Entre para comentar.</p>'}
        </div>`;
        await comentarios(id);
        document.getElementById('formComentario')?.addEventListener('submit', e => comentar(e,id,null));
        if (token()) {
            const u = JSON.parse(localStorage.getItem('usuario') || '{}');
            if (String(u.id) === String(i.usuario_id)) {
                document.getElementById('acoes').innerHTML = `<div style="margin-top:15px"><button class="btn secondary" onclick="mudarStatus(${i.id},'Reservado')">Reservar</button> <button class="btn secondary" onclick="mudarStatus(${i.id},'Doado')">Marcar como doado</button> <button class="btn danger" onclick="mudarStatus(${i.id},'Disponível')">Cancelar</button></div>`;
            }
        }
    } catch(e) { el.innerHTML = '<p class="msg error">'+esc(e.message)+'</p>'; }
}

async function comentarios(id) {
    const box = document.getElementById('comentarios');
    if (!box) return;
    try {
        const cs = await api('/comentarios/' + id);
        const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
        box.innerHTML = cs.length ? cs.map(c => `<div class="comment ${c.parent_id?'reply':''}"><b>${esc(c.nome_usuario)}</b><p>${esc(c.comentario)}</p><span class="small">${new Date(c.data).toLocaleString('pt-BR')}</span>${token()?`<br><button class="btn secondary" onclick="responder(${id},${c.id})">Responder</button>${String(c.usuario_id)===String(usuario.id)?` <button class="btn danger" onclick="excluirComentario(${c.id},${id})">Excluir</button>`:''}`:''}</div>`).join('') : '<p>Nenhuma pergunta ainda.</p>';
    } catch(e) { box.innerHTML = '<p class="msg error">'+esc(e.message)+'</p>'; }
}

async function comentar(e,id,parent) {
    e.preventDefault();
    const texto = e.target.comentario.value;
    try { await api('/comentarios/'+id,{method:'POST',headers:authHeaders(),body:JSON.stringify({comentario:texto,parent_id:parent})}); e.target.reset(); await comentarios(id); }
    catch(x){ alert(x.message); }
}

function responder(itemId,parentId) {
    const t = prompt('Digite sua resposta:');
    if (!t) return;
    api('/comentarios/'+itemId,{method:'POST',headers:authHeaders(),body:JSON.stringify({comentario:t,parent_id:parentId})}).then(()=>comentarios(itemId)).catch(e=>alert(e.message));
}

async function excluirComentario(id,itemId) {
    if (!confirm('Excluir este comentário?')) return;
    try { await api('/comentarios/'+id,{method:'DELETE',headers:authHeaders(false)}); await comentarios(itemId); }
    catch(e){ alert(e.message); }
}

async function mudarStatus(id,status) {
    try { await api('/itens/'+id+'/status',{method:'PUT',headers:authHeaders(),body:JSON.stringify({status})}); location.reload(); }
    catch(e){ alert(e.message); }
}

async function solicitar(id) {
    const m = prompt('Escreva uma mensagem para o doador:');
    if (!m) return;
    try { await api('/solicitacoes',{method:'POST',headers:authHeaders(),body:JSON.stringify({item_id:id,mensagem:m})}); alert('Solicitação enviada!'); }
    catch(e){ alert(e.message); }
}