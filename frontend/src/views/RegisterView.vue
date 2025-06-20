<template>
  <v-container class="d-flex justify-center align-center" style="height: 100vh">
    <v-card class="pa-6 elevation-12 rounded-lg" max-width="400">
      <v-card-title class="text-h5 mb-4 text-center">Crie sua conta</v-card-title>
      <v-form @submit.prevent="onSubmit">
        <v-text-field label="Nome" v-model="form.name" variant="outlined" dense class="mb-3" />
        <v-text-field label="Login" v-model="form.login" variant="outlined" dense class="mb-3" />

        <v-text-field label="Senha" :type="showPassword ? 'text' : 'password'" v-model="form.password"
          variant="outlined" dense class="mb-3" :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="showPassword = !showPassword" />

        <v-text-field label="Confirmar senha" :type="showConfirmPassword ? 'text' : 'password'"
          v-model="form.confirmPassword" variant="outlined" dense class="mb-3"
          :append-inner-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="showConfirmPassword = !showConfirmPassword"
          :error="form.confirmPassword.length > 0 && form.confirmPassword !== form.password"
          :error-messages="form.confirmPassword.length > 0 && form.confirmPassword !== form.password ? 'Senhas não coincidem' : ''" />

        <ul class="text-caption mb-3" style="padding-left: 16px;">
          <li :style="{ color: passwordStatus.minLength ? 'green' : 'red' }">
            Mínimo de 8 caracteres
          </li>
          <li :style="{ color: passwordStatus.hasUpper ? 'green' : 'red' }">
            Pelo menos uma letra maiúscula
          </li>
          <li :style="{ color: passwordStatus.hasLower ? 'green' : 'red' }">
            Pelo menos uma letra minúscula
          </li>
          <li :style="{ color: passwordStatus.hasNumber ? 'green' : 'red' }">
            Pelo menos um número
          </li>
          <li :style="{ color: passwordStatus.hasSymbol ? 'green' : 'red' }">
            Pelo menos um caractere especial
          </li>
        </ul>

        <v-btn type="submit" color="primary" block :disabled="!Object.values(passwordStatus).every(Boolean)">
          Registrar
        </v-btn>

        <v-alert v-if="error" type="error" class="mt-3" density="compact">
          {{ error }}
        </v-alert>

        <v-btn variant="text" class="mt-4 text-caption" color="primary" @click="router.push('/login')" block>
          Já tem uma conta? Faça login
        </v-btn>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { registerUser, loginUser } from "@/services/authService";
import { useRouter } from "vue-router";

const form = ref({
  name: "",
  login: "",
  password: "",
  confirmPassword: ""
});
const error = ref("");
const router = useRouter();
const showPassword = ref(false)
const showConfirmPassword = ref(false)

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

const passwordRules = {
  minLength: (pwd: string) => pwd.length >= 8,
  hasUpper: (pwd: string) => /[A-Z]/.test(pwd),
  hasLower: (pwd: string) => /[a-z]/.test(pwd),
  hasNumber: (pwd: string) => /[0-9]/.test(pwd),
  hasSymbol: (pwd: string) => /[^A-Za-z0-9]/.test(pwd),
};

const passwordStatus = computed(() => {
  const pwd = form.value.password;
  return {
    minLength: passwordRules.minLength(pwd),
    hasUpper: passwordRules.hasUpper(pwd),
    hasLower: passwordRules.hasLower(pwd),
    hasNumber: passwordRules.hasNumber(pwd),
    hasSymbol: passwordRules.hasSymbol(pwd),
    matchesConfirm: pwd === form.value.confirmPassword
  };
});

</script>
