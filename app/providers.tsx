"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { AuthModal } from "@/components/modals/AuthModal";
import { CreateQrModal } from "@/components/modals/CreateQrModal";
import { EditUrlModal } from "@/components/modals/EditUrlModal";
import { Toast } from "@/components/ui/Toast";

interface EditData {
  qrCodeId: string;
  shortCode: string;
  currentUrl: string;
}

interface AppCtxValue {
  user: User | null;
  openAuthModal: (tab?: "login" | "register") => void;
  openCreateModal: () => void;
  openEditModal: (data: EditData) => void;
  showToast: (message: string) => void;
}

const AppCtx = createContext<AppCtxValue | null>(null);

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authModal, setAuthModal] = useState<{
    open: boolean;
    tab: "login" | "register";
  }>({ open: false, tab: "login" });
  const [createOpen, setCreateOpen] = useState(false);
  const [editState, setEditState] = useState<{
    open: boolean;
    data: EditData | null;
  }>({ open: false, data: null });
  const [toast, setToast] = useState({ visible: false, message: "" });

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const openAuthModal = useCallback((tab: "login" | "register" = "login") => {
    setAuthModal({ open: true, tab });
  }, []);

  const openCreateModal = useCallback(() => setCreateOpen(true), []);

  const openEditModal = useCallback((data: EditData) => {
    setEditState({ open: true, data });
  }, []);

  const showToast = useCallback((message: string) => {
    setToast({ visible: true, message });
  }, []);

  const hideToast = useCallback(() => {
    setToast((p) => ({ ...p, visible: false }));
  }, []);

  return (
    <AppCtx.Provider
      value={{ user, openAuthModal, openCreateModal, openEditModal, showToast }}
    >
      {children}

      <AuthModal
        open={authModal.open}
        defaultTab={authModal.tab}
        onClose={() => setAuthModal((p) => ({ ...p, open: false }))}
        showToast={showToast}
      />

      <CreateQrModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        showToast={showToast}
      />

      {editState.data && (
        <EditUrlModal
          open={editState.open}
          qrCodeId={editState.data.qrCodeId}
          shortCode={editState.data.shortCode}
          currentUrl={editState.data.currentUrl}
          onClose={() => setEditState((p) => ({ ...p, open: false }))}
          showToast={showToast}
        />
      )}

      <Toast visible={toast.visible} message={toast.message} onHide={hideToast} />
    </AppCtx.Provider>
  );
}
