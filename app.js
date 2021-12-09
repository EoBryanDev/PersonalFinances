//2°criar objeto para receber os valores da função "CADASTRARDESPESA"
class Despesas{
	//ano, mes, dia, tipo, descricao, vlaor
	constructor(ano,mes,dia,tipo,descricao,valor){
		this.ano = ano
		this.mes = mes
		this.dia = dia
		this.tipo = tipo 
		this.descricao = descricao
		this.valor = valor

	}
	//7° validar se os dados preenchidos no formulário esta correto
	validarDados(){
		for(let i in this){
			if (this[i] == undefined || this[i] == '' || this[i] == null) {
				return false
			}

		}
		return true
	}
}
	//6° configurar o indice do bacno de dados para automatico e sequencial
class Bd{

	constructor(){
		let id = localStorage.getItem('id')

		if (id === null) {
			localStorage.setItem('id', 0)

			
		}
	}

	getProximoId(){
		let proximoId = localStorage.getItem('id')

		return parseInt(proximoId) + 1

		
	}

	gravar(despesas){
	//5°acesso da anotacao JSON para passar o objeto ao banco de dados, no caso o LOCAL STORAGE
		
		let id = this.getProximoId()

		localStorage.setItem(id,JSON.stringify(despesas))

		localStorage.setItem('id',id)
	}

	recuperarTodosRegistros(){
		let id = localStorage.getItem('id')

		let despesas = Array()

		for (var i = 1; i <= id;i++) {
			let despesa = JSON.parse(localStorage.getItem(i))

			if (despesa == null) {
				continue
			}

			despesa.id = i
			despesas.push(despesa)
			

			
		}
		
		return despesas
	}

	pesquisar(despesa){
		let despesasFiltradas = Array()


		despesasFiltradas = this.recuperarTodosRegistros()


		//ano
		if (despesa.ano != '') {
			despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
		}

		//mes
		if (despesa.mes != '') {
			despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
		}

		//dia
		if (despesa.dia != '') {
			despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
		}

		//tipo
		if (despesa.tipo != '') {
			despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
		}

		//descricao
		if (despesa.descricao != '') {
			despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
		}

		//valor
		if (despesa.valor != '') {
			despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
		}

		return despesasFiltradas


	}
	remover (id){
		localStorage.removeItem(id)

		window.location.reload()
	}
}

let bd = new Bd()



// 1° fazer uma função que capte através do método onclick os dados do formulário
function cadastrarDespesa(){

	let ano = document.getElementById('ano')
	let mes = document.getElementById('mes')
	let dia = document.getElementById('dia')
	let tipo = document.getElementById('tipo')
	let descricao = document.getElementById('descricao')
	let valor = document.getElementById('valor')
//3°Instanciar = Dar vida ao objeto, com a referencia dos dados obtidos através da funcao cadastrarDespesa e método "value"
	let despesas = new Despesas(
		ano.value,
		mes.value,
		dia.value,
		tipo.value,
		descricao.value,
		valor.value)
//4°criar função com o objeto para gravar no Web Storage
	
	if (despesas.validarDados()) {
		bd.gravar(despesas)
		document.getElementById('titulo').innerHTML = 'Cadastrado com sucesso'
		document.getElementById('titulo_modal').className = 'modal-header text-success'
		document.getElementById('modal_conteudo').innerHTML = 'O cadastro de despes foi realizado com sucesso!'
		document.getElementById('botao').className =  'btn btn-success'
		document.getElementById('botao').innerHTML = 'Voltar'

		$('#modalRegistraDespesa').modal('show')

		ano.value = ''
		mes.value = ''
		dia.value = ''
		tipo.value = ''
		descricao.value = ''
		valor.value = ''
		
		
		



	} else{
		//8°dinamizar o modal com mensagens de erro e de sucesso através da API do DOM
		document.getElementById('titulo').innerHTML = 'Erro na Gravação'
		document.getElementById('titulo_modal').className = 'modal-header text-danger'
		document.getElementById('modal_conteudo').innerHTML = 'Existem campos obrigatórios que não foram preenchidos'
		document.getElementById('botao').className =  'btn btn-danger'
		document.getElementById('botao').innerHTML = 'Voltar e corrigir'

		$('#modalRegistraDespesa').modal('show')
	}

	
}
//9° mostrar lista armazenada no bd
function carregaListaDespesas(despesas = Array(), filtro = false){
	if (despesas.length == 0 && filtro == false) {
		despesas = bd.recuperarTodosRegistros()
	}

	//10° adicionar elementos de busca
	let listaDespesas = document.getElementById('listaDespesas')
	listaDespesas.innerHTML = ''

	despesas.forEach(function(d){
		let linha = listaDespesas.insertRow()
		linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`
		
		switch(d.tipo){
			case '1': d.tipo = 'Alimentação'
				break
			case '2': d.tipo =  'Educação'
				break
			case '3': d.tipo = 'Lazer'
				break
			case '4': d.tipo = 'Saúde'
				break
			case '5': d.tipo = 'Transporte'
				break


		}
		linha.insertCell(1).innerHTML = d.tipo

		linha.insertCell(2).innerHTML = d.descricao
		linha.insertCell(3).innerHTML = d.valor

		let btn = document.createElement("button")
		btn.className = 'btn btn-danger'
		btn.innerHTML = '<i class="fas fa-times"></i>'
		btn.id = `id_despesas${d.id}`
		btn.onclick = function(){
			

			let id = this.id.replace('id_despesas','')

			

			bd.remover(id)
		}
		linha.insertCell(4).append(btn)

		console.log(d)

	})
}

function pesquisarDespesa(){
	let ano = document.getElementById('ano').value
	let mes = document.getElementById('mes').value
	let dia = document.getElementById('dia').value
	let tipo = document.getElementById('tipo').value
	let descricao = document.getElementById('descricao').value
	let valor = document.getElementById('valor').value

	let despesa = new Despesas(ano,mes,dia,tipo,descricao,valor)

	let despesas = bd.pesquisar(despesa)

	carregaListaDespesas(despesas, true)

	

	
}

