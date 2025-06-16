<template>
    <v-container>
        <v-row justify="space-between" align="center" class="mb-4">
            <v-col>
                <h1>Categorias</h1>
            </v-col>
            <div class="d-flex flex-column gap-2">
                <v-btn color="secondary" @click="goBackToDashboard">
                    <v-icon start>mdi-arrow-left</v-icon>
                    Voltar
                </v-btn>
            </div>
        </v-row>

        <v-alert v-if="error" type="error" class="mb-4">{{ error }}</v-alert>
        <v-btn color="primary" @click="openDialog()">Nova Categoria</v-btn>

        <v-row>
            <v-col v-for="category in categories" :key="category.id" cols="12" md="4" lg="3">
                <v-card>
                    <v-card-title>{{ category.name }}</v-card-title>
                    <v-card-actions>
                        <v-btn icon="mdi-pencil" @click="openDialog(category)" />
                        <v-btn icon="mdi-delete" color="error" @click="remove(category.id)" />
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>

        <v-dialog v-model="dialog" max-width="500">
            <v-card>
                <v-card-title>{{ editing ? 'Editar' : 'Nova' }} Categoria</v-card-title>
                <v-card-text>
                    <v-form @submit.prevent="save">
                        <v-text-field label="Nome" v-model="form.name" required />
                        <v-btn type="submit" color="primary" class="mt-4" block>
                            {{ editing ? 'Atualizar' : 'Salvar' }}
                        </v-btn>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory,
} from '@/services/categoryService'

const categories = ref<any[]>([])
const dialog = ref(false)
const editing = ref(false)
const error = ref('')
const form = ref({ id: null, name: '' })
import { useRouter } from 'vue-router'

const router = useRouter()

function goBackToDashboard() {
    router.push('/dashboard')
}

function openDialog(category: any = null) {
    if (category) {
        form.value = { ...category }
        editing.value = true
    } else {
        form.value = { id: null, name: '' }
        editing.value = false
    }
    dialog.value = true
}

async function load() {
    try {
        categories.value = await getAllCategories()
    } catch (err) {
        error.value = 'Erro ao carregar categorias'
    }
}

async function save() {
    try {
        if (editing.value) {
            await updateCategory(form.value.id, { name: form.value.name })
        } else {
            await createCategory({ name: form.value.name })
        }
        dialog.value = false
        await load()
    } catch (err) {
        error.value = 'Erro ao salvar categoria'
    }
}

async function remove(id: number) {
    try {
        await deleteCategory(id)
        await load()
    } catch (err) {
        error.value = 'Erro ao excluir categoria'
    }
}

onMounted(() => load())
</script>
