<template>
  <v-container class="d-flex justify-center align-center" style="height: 100vh">
    <v-card class="pa-6 elevation-12 rounded-lg" max-width="400">
      <v-card-title class="text-h5 mb-4 text-center">Entrar na sua conta</v-card-title>

      <v-form @submit.prevent="handleLogin">
        <v-text-field v-model="login" label="Login" prepend-icon="mdi-account" variant="outlined" dense class="mb-3" />

        <v-text-field v-model="password" :type="showPassword ? 'text' : 'password'" label="Senha"
          prepend-icon="mdi-lock" :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="showPassword = !showPassword" variant="outlined" dense class="mb-4" />

        <v-alert v-if="error" type="error" dense class="mb-3">
          {{ error }}
        </v-alert>

        <v-btn type="submit" color="primary" block>Entrar</v-btn>
      </v-form>

      <v-divider class="my-4"></v-divider>

      <v-btn variant="text" class="text-caption" color="primary" @click="router.push('/register')" block>
        Não tem uma conta? Cadastre-se
      </v-btn>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { loginUser } from "@/services/authService";

const router = useRouter();
const login = ref("");
const password = ref("");
const showPassword = ref(false);
const error = ref("");

const handleLogin = async () => {
  error.value = ""; // limpa erros anteriores
  try {
    const response = await loginUser({
      login: login.value,
      password: password.value,
    });

    localStorage.setItem("token", response.data.token);
    router.push("/dashboard");
  } catch (err: any) {
    if (err.response?.status === 400) {
      error.value = "Usuário não existe ou senha incorreta";
    } else {
      error.value = err.response?.data?.error || "Erro ao fazer login";
    }
  }
};
</script>
