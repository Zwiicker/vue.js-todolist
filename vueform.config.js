import pt_BR from '@vueform/vueform/locales/pt_BR'
import vueform from '@vueform/vueform/themes/vueform'
import { defineConfig } from '@vueform/vueform'

// You might place these anywhere else in your project
import '@vueform/vueform/themes/vueform/css/index.min.css';

export default defineConfig({
  theme: vueform,
  locales: { pt_BR },
  locale: 'pt_BR',
})