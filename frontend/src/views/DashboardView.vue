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

    <v-btn color="secondary" @click="goToCategories" class="mb-4">
      <v-icon start>mdi-format-list-bulleted</v-icon>
      Categorias
    </v-btn>

    <v-row justify="end" class="mb-4">
      <v-col cols="auto">
        <v-btn color="primary" @click="showDialog = true">Nova Receita</v-btn>
      </v-col>
    </v-row>

    <v-alert v-if="error" type="error" class="mb-4" density="comfortable">
      {{ error }}
    </v-alert>

    <v-row class="mb-4" align="center">
      <v-col cols="12" md="4">
        <v-text-field v-model="searchQuery" label="Search recipe" prepend-inner-icon="mdi-magnify" clearable
          @input="handleSearch" />
      </v-col>
      <v-col cols="12" md="4">
        <v-select v-model="selectedCategory" :items="categories" item-title="name" item-value="id"
          label="Filter by category" clearable @update:modelValue="handleSearch" />
      </v-col>
    </v-row>

    <v-row>
      <v-col v-for="recipe in recipes" :key="recipe.id" cols="12" md="6" lg="4">
        <v-card class="mb-4">
          <v-card-title class="text-h6">{{ recipe.name }}</v-card-title>
          <v-card-subtitle>
            {{ recipe.servings }} porções - {{ recipe.preparationTime }} min
          </v-card-subtitle>
          <v-card-text>
            {{ recipe.preparationMethod }}
          </v-card-text>
          <v-card-actions>
            <v-btn icon="mdi-eye" @click="view(recipe)" />
            <v-btn icon="mdi-printer" @click="printRecipe(recipe)" />
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
            <v-select v-model="form.categoryId" :items="categories" item-title="name" item-value="id" label="Categoria"
              required />
            <v-text-field v-model="form.servings" label="Porções" type="number" required />
            <v-text-field v-model="form.preparationTime" label="Tempo de preparo (min)" type="number" required />
            <v-textarea v-model="form.ingredients" label="Ingredientes" rows="3" />
            <v-textarea v-model="form.preparationMethod" label="Modo de preparo" rows="4" required />
            <v-btn type="submit" color="primary" class="mt-3" block>
              {{ editing ? 'Atualizar' : 'Salvar' }}
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showViewDialog" max-width="600">
      <v-card>
        <v-card-title class="text-h6 d-flex justify-space-between align-center">
          {{ selectedRecipe?.name }}
          <v-btn icon @click="printRecipe(selectedRecipe)">
            <v-icon>mdi-printer</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-subtitle>
          {{ selectedRecipe?.servings }} porções - {{ selectedRecipe?.preparationTime }} min
        </v-card-subtitle>
        <v-card-text>
          <strong>Ingredientes:</strong>
          <div style="white-space: pre-line;">{{ selectedRecipe?.ingredients }}</div>
          <br />
          <strong>Modo de Preparo:</strong>
          <div style="white-space: pre-line;">{{ selectedRecipe?.preparationMethod }}</div>
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
  deleteRecipeById,
  searchRecipes
} from '@/services/recipeService';
import { getAllCategories } from '@/services/categoryService';

const router = useRouter();
const recipes = ref<any[]>([]);
const categories = ref<any[]>([]);
const error = ref('');
const showDialog = ref(false);
const editing = ref(false);

const form = ref({
  id: null,
  name: '',
  categoryId: null,
  servings: 1,
  preparationTime: 10,
  preparationMethod: '',
  ingredients: '',
});

const searchQuery = ref('');
let searchTimeout: ReturnType<typeof setTimeout>;
const selectedCategory = ref<number | null>(null);

const showViewDialog = ref(false);
const selectedRecipe = ref<any | null>(null);

async function load() {
  try {
    recipes.value = await getAllRecipes();
    categories.value = await getAllCategories();
  } catch (err: any) {
    error.value = err.response?.data?.error || 'Erro ao carregar dados';
  }
}

function edit(recipe: any) {
  form.value = { ...recipe, categoryId: recipe.category?.id ?? recipe.categoryId };
  editing.value = true;
  showDialog.value = true;
}

function resetForm() {
  form.value = {
    id: null,
    name: '',
    categoryId: null,
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

function goToCategories() {
  router.push("/categories");
}

function handleSearch() {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(async () => {
    try {
      if (searchQuery.value.trim() || selectedCategory.value) {
        const params = new URLSearchParams();
        if (searchQuery.value.trim()) params.append("q", searchQuery.value.trim());
        if (selectedCategory.value) params.append("categoryId", selectedCategory.value.toString());
        recipes.value = await searchRecipes(searchQuery.value, selectedCategory.value);
      } else {
        recipes.value = await getAllRecipes();
      }
    } catch (err: any) {
      error.value = err.response?.data?.error || "Search failed";
    }
  }, 300);
}

function view(recipe: any) {
  selectedRecipe.value = recipe;
  showViewDialog.value = true;
}

function printRecipe(recipe: any) {
  const printContent = `
    <div>
      <h2>${recipe.name}</h2>
      <p><strong>Porções:</strong> ${recipe.servings}</p>
      <p><strong>Tempo de preparo:</strong> ${recipe.preparationTime} minutos</p>
      <p><strong>Ingredientes:</strong><br/>${recipe.ingredients?.replace(/\n/g, "<br/>")}</p>
      <p><strong>Modo de Preparo:</strong><br/>${recipe.preparationMethod?.replace(/\n/g, "<br/>")}</p>
    </div>
  `;

  const printWindow = window.open('', '', 'width=800,height=600');
  if (printWindow) {
    printWindow.document.write('<html><head><title>Imprimir Receita</title></head><body>');
    printWindow.document.write(printContent);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  }
}

onMounted(() => load());
</script>
