# ReelCraft — OMDb Studio

Interface moderna (HTML/CSS/JS) para explorar **todos os recursos públicos da OMDb API**:
- Busca paginada (`s`, `page`, `type`, `y`)
- Detalhes por **ID** (`i`) ou **Título** (`t`) com `plot=short|full`
- Alternância de **JSON/XML** e suporte a **JSONP** (no Request Builder)
- Exploração de **Séries** por **temporada** (`Season`) e **episódio** (`Episode`)
- **Watchlist** (favoritos) usando `localStorage`
- **Compare** (comparação lado a lado por IMDb ID)

> **Importante:** Para testar, você deve informar a **OMDb API key**.
Neste projeto, use **`5d6fb54c`** (pode ser trocada a qualquer momento pela sua própria).

---

## 🚀 Como rodar localmente
### Opção 1 (mais simples)
- Dê **duplo clique** em `index.html` para abrir no navegador.

### Opção 2 (servidor local recomendado)
```bash
# na pasta do projeto
python -m http.server 5501
# acesse http://localhost:5501
```

---

## 🔑 Configurando a API Key (obrigatório)
1. Abra o site.
2. Clique em **⚙️ Configurar API Key** (canto superior direito).
3. Cole **`5d6fb54c`** em **“OMDb API Key (dados)”** e clique **Salvar**.
4. Pronto! Faça uma busca (ex.: “Batman”).

> Observação: a chave fica salva no `localStorage` do navegador.  
> Você pode substituí-la por outra quando quiser.

---

## 🧭 Seções principais
- **Home**: busca com filtros, cards e modal de detalhes.
- **Series Explorer**: liste temporadas e episódios por `i` ou `t`.
- **Request Builder**: monte qualquer requisição (JSON/XML/JSONP) e visualize a resposta crua.
- **Compare**: compare 2 títulos por IMDb ID.
- **Watchlist**: gerencie favoritos; exporte/importe JSON.

---

## 📁 Estrutura
```
.
├── index.html
└── assets/
    ├── css/styles.css
    ├── js/
    │   ├── app.js
    │   ├── omdb.js
    │   ├── utils.js
    │   ├── ui.js
    │   ├── builder.js
    │   ├── series.js
    │   ├── compare.js
    │   └── storage.js
    └── img/
        ├── logo.svg
        └── placeholder.svg
```

---


## 📜 Licença
Uso livre para portfólio/demonstrações.
