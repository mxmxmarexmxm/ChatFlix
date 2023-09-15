import React, { createContext, useState, useContext } from 'react';

const ModalContext = createContext();

export function useModal() {
  return useContext(ModalContext);
}

export function ModalProvider({ children }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const openModal = (content) => {
    setModalContent(content);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalContent(null);
    setModalVisible(false);
  };

  return (
    <ModalContext.Provider
      value={{ modalVisible, openModal, closeModal, modalContent }}
    >
      {children}
    </ModalContext.Provider>
  );
}
