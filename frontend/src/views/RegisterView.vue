<template>
  <v-container class="d-flex justify-center align-center" style="height: 100vh">
    <v-card class="pa-6 elevation-12 rounded-lg" max-width="400">
      <v-card-title class="text-h5 mb-4 text-center">Crie sua conta</v-card-title>
      <v-form @submit.prevent="onSubmit">
        <v-text-field label="Nome" v-model="form.name" variant="outlined" dense class="mb-3" />
        <v-text-field label="Login" v-model="form.login" variant="outlined" dense class="mb-3" />
        <v-text-field label="Senha" type="password" v-model="form.password" variant="outlined" dense class="mb-3" />

        <v-btn type="submit" color="primary" block>Registrar</v-btn>

        <v-alert v-if="error" type="error" class="mt-3" density="compact">{{ error }}</v-alert>

        <v-btn variant="text" class="mt-4 text-caption" color="primary" @click="$router.push('/login')" block>
          Já tem uma conta? Faça login
        </v-btn>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { registerUser, loginUser } from "@/services/authService";
import { useRouter } from "vue-router";

const form = ref({ name: "", login: "", password: "" });
const error = ref("");
const router = useRouter();

async function onSubmit() {
  try {
    await registerUser(form.value);

    // Após o cadastro, faz login automático
    const loginResponse = await loginUser({
      login: form.value.login,
      password: form.value.password,
    });

    localStorage.setItem("token", loginResponse.data.token);
    router.push("/dashboard");
  } catch (err: any) {
    error.value = err.response?.data?.error || "Erro ao registrar";
  }
}
</script>
