<template>
	<div class="page">
		<div class="container">
			<h1>Lista de Tarefas</h1>

			<!-- Adicionando uma tarefa -->
			<Vueform size="lg" :endpoint="createTask">

				<!-- Entrada da tarefa -->
				<TextElement
					name="task"
					placeholder="Adicionar uma tarefa"
					floating="Nome da Tarefa"
					rules="required"
				/>

				<!-- Tipo de tarefa -->
				<RadiogroupElement
					name="type"
					:items="['Pessoal', 'Estudos', 'Trabalho']"
					view="tabs"
					default="Pessoal"
				/>

				<!-- Enviar -->
				<ButtonElement
					name="button"
					align="right"
					submits
				>
					Enviar
				</ButtonElement>
			</Vueform>

			<hr class="divider" />

			<!-- Lista de tarefas -->
			<Vueform v-model="tasksModel" sync> <!-- `sync` para atualizar a lista quando `tasksModel` muda -->

				<!-- Lista de tarefas -->
				<ListElement
					name="tasks"
					:controls="{
						add: false, // para desabilitar a adição de novos elementos à lista
					}"
					:add-class="{
						handle: 'task-sort-handle' // para corrigir a posição superior da alça
					}"
					sort
					@sort="syncToStorage"
					@remove="syncToStorage"
				>
					<template #default="{ index }">

						<!-- Contêiner da tarefa -->
<ObjectElement
   :name="index"
   :add-class="[
      'task-container',
      tasksModel.tasks[index].type === 'Pessoal' ? 'is-pessoal' : (tasksModel.tasks[index].type === 'Estudos' ? 'is-estudos' : 'is-trabalho')
   ]"
>

						<!-- Botão de edição, usando o nome da tarefa com o índice como rótulo - visível apenas quando não estiver editando -->
						<ButtonElement
							:label="`#${index + 1} - ${tasksModel.tasks[index].task}`"
							name="edit"
							align="right"
							:conditions="[
								['editing', '!=', index]
							]"
							:columns="{
								label: 6,
							}"
							@click="edit(index)"
						>
							Editar
						</ButtonElement>

	<!-- Botão de marcar como feito - visível apenas quando estiver editando -->
    <ButtonElement
        name="feito"
        align="left"
        :conditions="[
            ['editing', index],
        ]"
        :columns="{
            label: 6,
        }"
        class="vf-button-feito"
        @click="feito(index)"
    >
        Feito
    </ButtonElement>


						<!-- Entrada da tarefa durante a edição -->
						<TextElement 
							name="task"
							:conditions="[
								['editing', index]
							]"
							:columns="6"
							:class="{
								'is-done': tasksModel.tasks[index].done
							}"
						/>

						<!-- Tipo de tarefa durante a edição -->
						<RadiogroupElement 
							name="type"
							view="tabs"
							:conditions="[
								['editing', index]
							]"
							:columns="6"
							:items="{
								'Pessoal': 'Pessoal',
								'Estudos': 'Estudo',
								'Trabalho': 'Trabalho',
							}"
						/>

						<!-- Cancelar edição da tarefa -->
						<ButtonElement
							name="cancel"
							:conditions="[
								['editing', index]
							]"
							:columns="3"
							danger
							full
							@click="cancel"
						>
							Cancelar
						</ButtonElement>

						<!-- Salvar tarefa -->
						<ButtonElement
							name="save"
							:conditions="[
								['editing', index]
							]"
							:columns="3"
							full
							@click="save"
						>
							Salvar
						</ButtonElement>

						</ObjectElement>
					</template>
				</ListElement>

				<!-- Armazena qual campo estamos editando para que as condições possam depender disso -->
				<HiddenElement name="editing" />
			</Vueform>
		</div>
	</div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

// O modelo para o formulário da lista de tarefas
const tasksModel = ref({
	tasks: [], // lista de tarefas
	editing: null, // tarefa atual que estamos editando
})

// Criando uma tarefa e salvando-a no localStorage
const createTask = (data, form$) => {
	addToStorage(form$.data) // primeiro adiciona ao localStorage
	syncFromStorage() // em seguida, sincroniza o `tasksModel` a partir do localStorage

	form$.reset() // então, redefina o formulário
	// form$.clear() // Isso é usado para limpar completamente o formulário em vez de redefinir
}

// Adiciona uma nova tarefa ao localStorage
const addToStorage = (data) => {
	let storageData = localStorage.getItem('tasks')
	storageData = storageData ? JSON.parse(storageData) : []

	storageData.push(data)
	localStorage.setItem('tasks', JSON.stringify(storageData))
}

// Sincroniza o localStorage com `tasksModel`
const syncFromStorage = () => {
	let tasks = localStorage.getItem('tasks')

	tasksModel.value = {
		tasks: tasks ? JSON.parse(tasks) : []
	}
}

// Sincroniza o `tasksModel.tasks` com o localStorage
const syncToStorage = () => {
	localStorage.setItem('tasks', JSON.stringify(tasksModel.value.tasks))
}

// Define as tarefas a editar
const edit = (index) => {
	tasksModel.value.editing = index
}

// Marca a tarefa como feita
const feito = (index) => {
	tasksModel.value.tasks.splice(index, 1);
	tasksModel.value.editing = null;
    syncToStorage();

}

// Cancela a edição da tarefa
const cancel = (index) => {
	tasksModel.value.editing = null
	syncFromStorage()
}

// Salva a tarefa
const save = () => {
	syncToStorage()
	tasksModel.value.editing = null
}

// Sincroniza o `tasksModel` a partir do localStorage no carregamento da página
onMounted(() => {
	syncFromStorage()
})
</script>

<style lang="scss">
.page {
	background: #f1f3f9;
	width: 100%;
	min-height: 100vh;
	padding-top: 2rem;
}

.container {
	max-width: 600px;
	margin: 0 auto;
}

h1 {
	font-size: 48px;
	margin-bottom: 2rem;
	font-weight: 600;
}

.divider {
	margin: 2rem 0;
	border-color: #e2e8f0;
}

.task-container {
	background: #ffffff;
	padding: 1rem;

	&.is-pessoal {
		border-left: 3px solid green;
	}

	&.is-estudos {
		border-left: 3px solid blue;
	}

	&.is-trabalho {
		border-left: 3px solid red;
	}
}

.task-wrapper {
	display: flex;
	align-items: center;
}

.vf-list-handle.task-sort-handle {
	top: 1rem;
}


</style>
