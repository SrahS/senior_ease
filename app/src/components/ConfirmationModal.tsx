import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface ConfirmationModalProps {
  visible: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  isConfirming?: boolean;
}

export function ConfirmationModal({ 
  visible, 
  title = "Confirmar ação", 
  message, 
  onConfirm, 
  onCancel,
  confirmLabel = 'Sim, confirmar',
  isConfirming = false,
}: ConfirmationModalProps) {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onCancel}
    >
      {}
      <View style={styles.overlay} accessibilityViewIsModal>
        <View style={styles.modalCard} accessibilityRole="alert">
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardText}>{message}</Text>
          
          <View style={styles.actions}>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel={confirmLabel}
              disabled={isConfirming}
              style={[styles.button, styles.confirmButton, isConfirming && styles.disabledButton]}
              onPress={onConfirm}
            >
              <Text style={styles.buttonText}>{isConfirming ? 'Excluindo...' : confirmLabel}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Cancelar"
              disabled={isConfirming}
              style={[styles.button, styles.cancelButton, isConfirming && styles.disabledButton]}
              onPress={onCancel}
            >
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: '#fef3c7',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    borderWidth: 1,
    borderColor: '#fbbf24',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  cardTitle: { fontSize: 20, fontWeight: '700', color: '#0f172a', marginBottom: 8 },
  cardText: { fontSize: 16, color: '#475569', marginBottom: 20 },
  actions: { flexDirection: 'row', gap: 12, flexWrap: 'wrap' },
  button: { flex: 1, paddingVertical: 12, borderRadius: 999, alignItems: 'center' },
  confirmButton: { backgroundColor: '#16a34a' },
  disabledButton: { opacity: 0.55 },
  buttonText: { color: '#ffffff', fontWeight: '700', fontSize: 16 },
  cancelButton: { backgroundColor: '#fef2f2', borderWidth: 1, borderColor: '#fca5a5' },
  cancelText: { color: '#ef4444', fontWeight: '700', fontSize: 16 },
});