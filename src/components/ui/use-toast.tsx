// filepath: d:\Quatthoi\dixemphim\frontend\src\components\ui\use-toast.tsx
import * as React from "react";
import { type ToastActionElement, type ToastProps } from "@/components/ui/toast";

const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 1000000;

type ToastType = "default" | "destructive" | "success" | "warning" | "info";

type ToastT = {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  variant?: ToastType;
  open: boolean;
};

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_VALUE;
  return count.toString();
}

type ActionType = typeof actionTypes;

type Action =
  | {
      type: ActionType["ADD_TOAST"];
      toast: Omit<ToastT, "id" | "open">;
    }
  | {
      type: ActionType["UPDATE_TOAST"];
      toast: Partial<ToastT> & { id: string };
    }
  | {
      type: ActionType["DISMISS_TOAST"];
      toastId?: string;
    }
  | {
      type: ActionType["REMOVE_TOAST"];
      toastId?: string;
    };

interface State {
  toasts: ToastT[];
}

const initialState: State = {
  toasts: [],
};

function toastReducer(state: State, action: Action): State {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return {
        ...state,
        toasts: [
          ...state.toasts,
          { ...action.toast, id: genId(), open: true },
        ].slice(-TOAST_LIMIT),
      };

    case actionTypes.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    case actionTypes.DISMISS_TOAST: {
      const { toastId } = action;

      // If no toast ID is provided, dismiss all toasts
      if (toastId === undefined) {
        return {
          ...state,
          toasts: state.toasts.map((t) => ({ ...t, open: false })),
        };
      }

      // Otherwise dismiss the specified toast
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId ? { ...t, open: false } : t
        ),
      };
    }

    case actionTypes.REMOVE_TOAST: {
      const { toastId } = action;

      // If no toast ID is provided, remove all toasts
      if (toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }

      // Otherwise remove the specified toast
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== toastId),
      };
    }
  }
}

const listeners: Array<(state: State) => void> = [];

let memoryState: State = initialState;

function dispatch(action: Action) {
  memoryState = toastReducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

type Toast = Omit<ToastT, "id" | "open">;

function toast(props: Toast) {
  const { ...data } = props;

  dispatch({
    type: actionTypes.ADD_TOAST,
    toast: data,
  });
}

function updateToast(
  toastId: string,
  data: Partial<Omit<ToastT, "id" | "open">>
) {
  dispatch({
    type: actionTypes.UPDATE_TOAST,
    toast: { ...data, id: toastId },
  });
}

function dismissToast(toastId?: string) {
  dispatch({
    type: actionTypes.DISMISS_TOAST,
    toastId,
  });
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  return {
    ...state,
    toast,
    dismiss: dismissToast,
    update: updateToast,
  };
}

export { useToast, toast };