import React, { createContext, useState, useContext } from 'react';

const ModalContext = createContext();

export function useModal() {
  return useContext(ModalContext);
}

export function ModalProvider({ children }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [modalTitle, setTitle] = useState(null);

  const openModal = (content, modalTitle) => {
    setModalContent(content);
    setModalVisible(true);
    setTitle(modalTitle);
  };

  const closeModal = () => {
    setModalContent(null);
    setModalVisible(false);
  };

  return (
    <ModalContext.Provider
      value={{ modalVisible, openModal, closeModal, modalContent, modalTitle }}
    >
      {children}
    </ModalContext.Provider>
  );
}
