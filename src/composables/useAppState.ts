import { reactive } from 'vue';

interface AppState {
  currentView: string;
  selectedCountry: string | null;
  selectedNonFramework: string | null;
}

const state = reactive<AppState>({
  currentView: 'standings',
  selectedCountry: 'FRA',
  selectedNonFramework: null,
});

export function useAppState() {
  function setView(view: string) {
    state.currentView = view;
  }

  function selectCountry(alpha3: string) {
    state.selectedCountry = alpha3;
    state.selectedNonFramework = null;
  }

  function selectNonFramework(name: string) {
    state.selectedCountry = null;
    state.selectedNonFramework = name;
  }

  return { state, setView, selectCountry, selectNonFramework } as const;
}
