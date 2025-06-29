//REGRINHA DO CODIGO: 
//Se você muda o array listColumns, e quer que isso apareça na interface, chame renderColumns().


// CRIANDO COLUNAS COM ARRAY

const btnCreateColumn = document.getElementById('btn-add')
const modalColumn = document.getElementById('overlay-modal-column')
const cancelModal = document.getElementById('cancel-column')
const saveModal = document.getElementById('save-column')
const titleDigitedModal = document.getElementById('column-title')
const allColumns = document.querySelector('.all-columns')

// Coluna inicial (já existente no HTML)
let listColumns = [
  {
    id: 0,
    titulo: "Nome da coluna",
    cards: [
      {
        id: Date.now() + 1,         // Só pra garantir um ID diferente
        texto: "Texto do card",
        prioridade: "baixa",
        status: "inProgress",
        categoria: "trabalho"
      }
    ]
  }
]

//SALVANDO NO LOCALSTORAGE

function salvarNoLocalStorage() {
  localStorage.setItem('columns', JSON.stringify(listColumns))
}

const dadosSalvos = localStorage.getItem('columns')

if (dadosSalvos) {
  listColumns = JSON.parse(dadosSalvos)
} else {
  // se não tiver nada salvo, usa uma coluna padrão
  listColumns = [
    {
      id: 0,
      titulo: "Nome da coluna",
      status: "inProgress",
      cards: [
        {
          id: Date.now() + 1,
          texto: "Texto do card",
          prioridade: "baixa",
          status: "inProgress",
          categoria: "trabalho"
        }
      ]
    }
  ]
}

// Exibir colunas iniciais
renderColumns()

btnCreateColumn.addEventListener('click', () => {
  modalColumn.style.display = 'block'
  titleDigitedModal.focus()
})

cancelModal.addEventListener("click", () => {
  modalColumn.style.display = 'none'
  titleDigitedModal.value = ''
})

saveModal.addEventListener('click', addColumn)

titleDigitedModal.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    saveModal.click()
  }
})

function addColumn() {
  const title = titleDigitedModal.value.trim()
  if (!title) return

  listColumns.push({
    id: Date.now(),
    titulo: title,
    status: "inProgress",
    cards: [],

  })

  titleDigitedModal.value = ''
  modalColumn.style.display = 'none'

  renderColumns()
  salvarNoLocalStorage()
}

function renderColumns() {
  allColumns.innerHTML = ''

  listColumns.forEach(column => {
    // Gerar os cards HTML
    let cardsHTML = ''
    column.cards.forEach(card => {   //esse card esta dentro do array da coluna, quando cria uma coluna, ja cria esse array(card) dentro do array da coluna
      cardsHTML += `
        <div class="card ${card.prioridade} ${card.status === "done" ? "danm" : ""}" data-id="${card.id}" data-category="${card.categoria}" data-priority="${card.prioridade}" data-status="${card.status}">
          <i class='bxr bx-hand' style='color:#5f5f5f'></i>
          <input type="checkbox" class="check-task" ${card.status === "done" ? "checked" : ""}>
          <p>${card.texto}</p>
          <div class="remove-edit-card">
            <div class="remove">
              <button type="button" class="remove-card">
                <i class='bxr bx-trash' style='color:#5f5f5f'></i>
              </button>
            </div>
            <div class="edit">
              <button type="button" class="editName-card">
                <i class='bxr bx-pencil' style='color:#5f5f5f'></i>
              </button>
            </div>
          </div>
        </div>
      `
    })

    // Adiciona a coluna completa com os cards
    const columnHTML = `
      <div class="column ${column.status === "done" ? "danm" : ""}" data-id="${column.id}" data-id="${column.id}">
        <div class="title-column">
        <input type="checkbox" class="check-column" ${column.status === "done" ? "checked" : ""}>
          <h1>${column.titulo}</h1>
          <div class="remove-edit">
            <div class="add"> <button type="button" class="add-card"> + </button> </div>
            <div class="remove"> <button type="button" class="remove-column"> <i class='bxr bx-trash' style='color:#5f5f5f'></i> </button> </div>
            <div class="edit"> <button type="button" class="editName-column"> <i class='bxr bx-pencil' style='color:#5f5f5f'></i> </button> </div>
          </div>
        </div>
        <div class="cont-cards">
          ${cardsHTML}
        </div>
      </div>
    `

    allColumns.innerHTML += columnHTML
  })

  salvarNoLocalStorage()
}

///ADICIONANDO CARDS e EDITANDO ELES

const btnCreateCards = document.querySelector('.add-card')
const btnRemoveEditCard = document.querySelector('.remove-edit-card ')
const btnRemoveCard = document.querySelector('.remove-card')
const modalCard = document.getElementById("overlay-modal-card")

const btnSaveCard = document.getElementById('save-task')
const btnCancelCard = document.getElementById('cancel-task')

const inputTextCard = document.getElementById('task-title')
const inputSelectCard = document.getElementById('task-priority')

const cardsLocal = document.querySelector('.cont-cards')
const column = document.querySelector('.column')

////////////////////////////////////////

btnCancelCard.addEventListener('click', () => {
  modalCard.style.display = 'none'
})

btnSaveCard.addEventListener('click', addCard)

inputTextCard.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    btnSaveCard.click()
  }
})

//////////////////////////////////////

let currentColumnId = null  //serve como controle temporário para armazenar em qual coluna o card será adicionado.

function addCard() {

  const texto = inputTextCard.value.trim()
  const prioridade = inputSelectCard.value

  if (!texto || !prioridade) return

  const columnIndex = listColumns.findIndex(col => col.id === currentColumnId)
  if (columnIndex === -1) return

  listColumns[columnIndex].cards.push({
    id: Date.now(),
    texto,
    prioridade,
    status: "inProgress",
    categoria: "trabalho"
  })



  inputTextCard.value = ''
  inputSelectCard.value = ''
  modalCard.style.display = 'none'

  renderColumns() // Isso renderiza todas as colunas com seus cards atualizados
}

//BOTANDO EVENTOS DE CLIQUES (nao foi feito depois, botei aqui pela organizacao, apenas os que precisam do "allColumns", o resto está onde deve estar)

allColumns.addEventListener('click', event => {

  // REMOVER COLUNA
  const btnRemove = event.target.closest('.remove-column')

  if (btnRemove) {
    const column = btnRemove.closest('.column')
    const id = Number(column.dataset.id)
    listColumns = listColumns.filter(col => col.id !== id)  //.filter() cria um novo array, com todos os itens que NÃO têm o id da coluna clicada.
    renderColumns()
    salvarNoLocalStorage()
    return
  }

  // EDITAR COLUNA
  const btnEdit = event.target.closest('.editName-column')

  if (btnEdit) {
    const column = btnEdit.closest('.column')
    const id = Number(column.dataset.id)

    const titleEl = column.querySelector('h1')
    const oldTitle = titleEl.textContent

    const input = document.createElement('input')
    input.type = 'text'
    input.value = oldTitle
    input.classList.add('input-edit-column')

    column.querySelector('.title-column').replaceChild(input, titleEl) //(Novo, antigo)
    input.focus()

    let saved = false

    function saveEdition() {
      if (saved) return
      saved = true

      const newName = input.value.trim() || 'Sem título'
      const newH1 = document.createElement('h1')
      newH1.textContent = newName
      input.parentNode.replaceChild(newH1, input)  //(Novo, antigo)

      const columnIndex = listColumns.findIndex(col => col.id === id)
      if (columnIndex !== -1) listColumns[columnIndex].titulo = newName

      salvarNoLocalStorage()
    }

    input.addEventListener('blur', saveEdition)
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') saveEdition()
    })
  }

  /////CARD/////

  const btnAddCard = event.target.closest('.add-card')

  if (btnAddCard) {

    modalCard.style.display = 'block'

    const column = btnAddCard.closest('.column')
    currentColumnId = Number(column.dataset.id)
    // guarda esse columnId em alguma variável (por exemplo: currentColumnId)
    // e abre o modal de card

    return
  }

  // REMOVER CARD

  const btnRemoveCard = event.target.closest('.remove-card')

  if (btnRemoveCard) {
    const cardElement = btnRemoveCard.closest('.card')              // Pega o card no HTML
    const cardId = Number(cardElement.dataset.id)                   // Pega o ID do card

    const columnElement = btnRemoveCard.closest('.column')          // Pega a coluna do card
    const columnId = Number(columnElement.dataset.id)               // ID da coluna

    const column = listColumns.find(col => col.id === columnId)     // Busca a coluna no array

    if (column) {
      column.cards = column.cards.filter(card => card.id !== cardId) // Remove o card da coluna
      renderColumns()
      salvarNoLocalStorage()                                             // Atualiza a tela
    }

    return
  }

  //EDITAR CARD

  const btnEditCard = event.target.closest('.editName-card')

  if (btnEditCard) {
    const cardElement = btnEditCard.closest('.card')              // elemento .card do DOM
    const cardId = Number(cardElement.dataset.id)

    const columnElement = btnEditCard.closest('.column')          // elemento .column do DOM
    const columnId = Number(columnElement.dataset.id)

    // encontra a coluna no array
    const columnData = listColumns.find(col => col.id === columnId)
    if (!columnData) return

    // encontra o card dentro da coluna
    const cardData = columnData.cards.find(card => card.id === cardId)
    if (!cardData) return

    // pega o <p> que mostra o texto atual
    const p = cardElement.querySelector('p')
    const oldText = p.textContent

    // cria input para edição
    const input = document.createElement('input')
    input.type = 'text'
    input.value = oldText
    input.classList.add('input-edit-card')

    cardElement.replaceChild(input, p)
    input.focus()

    let saved = false

    function saveEdit() {
      if (saved) return
      saved = true

      const newText = input.value.trim() || "Sem conteúdo"
      cardData.texto = newText  // atualiza no array

      const newP = document.createElement('p')
      newP.textContent = newText

      cardElement.replaceChild(newP, input)  // atualiza no DOM
      salvarNoLocalStorage()
    }

    input.addEventListener('blur', saveEdit)
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') saveEdit()
    })
  }

  //CHECKBOX CONCLUIDO

  const checkBox = event.target.closest('.check-task')

  if (checkBox) {
    const cardElement = checkBox.closest('.card')
    const cardId = Number(cardElement.dataset.id)

    const columnElement = checkBox.closest('.column')
    const columnId = Number(columnElement.dataset.id)

    const column = listColumns.find(col => col.id === columnId)
    if (!column) return

    const card = column.cards.find(card => card.id === cardId)
    if (!card) return

    card.status = checkBox.checked ? "done" : "inProgress"

    if (card.status === "done") {
      cardElement.classList.add("danm")
    } else {
      cardElement.classList.remove("danm")
    }

    ///////////////////////////////
 
    const todosConcluidos = column.cards.every(card => card.status === "done")  //todo card TEM que ter status = 'done'
    
    const columnCheckbox = columnElement.querySelector('.check-column')

    if (todosConcluidos) {
      column.status = "done"
      columnElement.classList.add("danm")
      columnCheckbox.checked = true
    } 
    else {
      column.status = "inProgress"
      columnElement.classList.remove("danm")
      columnCheckbox.checked = false
    }

    
    salvarNoLocalStorage()
    renderColumns()
    return
  }


  //CHECK COLUNA

  const checkColumn = event.target.closest('.check-column')

  if (checkColumn) {
    const columnElement = checkColumn.closest('.column')
    const columnId = Number(columnElement.dataset.id)

    const column = listColumns.find(col => col.id === columnId)
    if (!column) return


    const novoStatus = checkColumn.checked ? "done" : "inProgress"

    column.cards.forEach(card => {
      card.status = novoStatus
    })


    column.status = novoStatus
    if (novoStatus === "done") {
      columnElement.classList.add("danm")
    } else {
      columnElement.classList.remove("danm")
    }

    salvarNoLocalStorage()
    renderColumns()
    return
  }


})

//REGRINHA DO CODIGO: 
//Se você muda o array listColumns, e quer que isso apareça na interface, chame renderColumns().