import React, { createContext, useState, useContext } from 'react';

const ModalContext = createContext();

export function useModal() {
  return useContext(ModalContext);
}

export function ModalProvider({ children }) {
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <ModalContext.Provider value={{ modalVisible, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
}
