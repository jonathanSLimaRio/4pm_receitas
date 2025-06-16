<template>
  <v-container>
    <v-row justify="space-between" align="center" class="mb-6">
      <v-col>
        <h1>Minhas Receitas</h1>
      </v-col>
      <v-col cols="auto" class="d-flex align-center gap-2">
        <v-btn icon @click="handleLogout" color="error">
          <v-icon>mdi-logout</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <v-row justify="end" class="mb-4">
      <v-col cols="auto">
        <v-btn color="primary" @click="showDialog = true">Nova Receita</v-btn>
      </v-col>
    </v-row>

    <!-- Alerta de erro -->
    <v-alert v-if="error" type="error" class="mb-4" density="comfortable">
      {{ error }}
    </v-alert>

    <v-row>
      <v-col
        v-for="recipe in recipes"
        :key="recipe.id"
        cols="12"
        md="6"
        lg="4"
      >
        <v-card class="mb-4">
          <v-card-title class="text-h6">
            {{ recipe.name }}
          </v-card-title>
          <v-card-subtitle>
            {{ recipe.servings }} porções - {{ recipe.preparationTime }} min
          </v-card-subtitle>
          <v-card-text>
            {{ recipe.preparationMethod }}
          </v-card-text>
          <v-card-actions>
            <v-btn icon="mdi-pencil" @click="edit(recipe)" />
            <v-btn icon="mdi-delete" color="error" @click="remove(recipe.id)" />
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="showDialog" max-width="600">
      <v-card>
        <v-card-title>{{ editing ? 'Editar' : 'Nova' }} Receita</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="save">
            <v-text-field v-model="form.name" label="Nome" required />
            <v-text-field
              v-model="form.servings"
              label="Porções"
              type="number"
              required
            />
            <v-text-field
              v-model="form.preparationTime"
              label="Tempo de preparo (min)"
              type="number"
              required
            />
            <v-textarea
              v-model="form.ingredients"
              label="Ingredientes"
              rows="3"
            />
            <v-textarea
              v-model="form.preparationMethod"
              label="Modo de preparo"
              rows="4"
              required
            />
            <v-btn type="submit" color="primary" class="mt-3" block>
              {{ editing ? 'Atualizar' : 'Salvar' }}
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  getAllRecipes,
  createRecipe,
  updateRecipe,
  deleteRecipeById
} from '@/services/recipeService';

const router = useRouter();
const recipes = ref<any[]>([]);
const error = ref('');
const showDialog = ref(false);
const editing = ref(false);
const form = ref({
  id: null,
  name: '',
  servings: 1,
  preparationTime: 10,
  preparationMethod: '',
  ingredients: '',
});

async function load() {
  try {
    recipes.value = await getAllRecipes();
  } catch (err: any) {
    error.value = err.response?.data?.error || 'Erro ao carregar receitas';
  }
}

function edit(recipe: any) {
  form.value = { ...recipe };
  editing.value = true;
  showDialog.value = true;
}

function resetForm() {
  form.value = {
    id: null,
    name: '',
    servings: 1,
    preparationTime: 10,
    preparationMethod: '',
    ingredients: '',
  };
  editing.value = false;
}

async function save() {
  try {
    if (editing.value) {
      await updateRecipe(form.value);
    } else {
      await createRecipe(form.value);
    }
    showDialog.value = false;
    resetForm();
    await load();
  } catch (err: any) {
    error.value = err.response?.data?.error || 'Erro ao salvar receita';
  }
}

async function remove(id: number) {
  try {
    await deleteRecipeById(id);
    await load();
  } catch (err: any) {
    error.value = err.response?.data?.error || 'Erro ao excluir receita';
  }
}

function handleLogout() {
  localStorage.removeItem('token');
  router.push('/login');
}

onMounted(() => load());
</script>
