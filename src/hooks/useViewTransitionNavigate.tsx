
import { useNavigate } from "react-router-dom";

export function useViewTransitionNavigate() {
  const navigate = useNavigate();

  function transitionNavigate(path: string) {
    if (!document.startViewTransition) {
      navigate(path);
      return;
    }

    document.startViewTransition(() => {
      navigate(path);
    });
  }

  return transitionNavigate;
}