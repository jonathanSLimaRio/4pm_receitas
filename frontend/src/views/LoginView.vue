<template>
  <v-container class="d-flex justify-center align-center" style="height: 100vh">
    <v-card class="pa-6 elevation-12 rounded-lg" max-width="400">
      <v-card-title class="text-h5 mb-4 text-center">Entrar na sua conta</v-card-title>

      <v-text-field v-model="login" label="Login" prepend-icon="mdi-account" variant="outlined" dense class="mb-3" />
      <v-text-field v-model="password" label="Senha" prepend-icon="mdi-lock" type="password" variant="outlined" dense class="mb-4" />

      <v-btn color="primary" @click="handleLogin" block>Entrar</v-btn>

      <v-divider class="my-4"></v-divider>

      <v-btn variant="text" class="text-caption" color="primary" @click="$router.push('/register')" block>
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

const handleLogin = async () => {
  try {
    const response = await loginUser({
      login: login.value,
      password: password.value,
    });

    localStorage.setItem("token", response.data.token);
    router.push("/dashboard");
  } catch (err: any) {
    alert(err.response?.data?.error || "Erro ao fazer login");
  }
};
</script>
