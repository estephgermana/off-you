// src/pages/Questionario.tsx
import React from 'react';

const Questionario: React.FC = () => {
  return (
    <div>
      <h1>Questionário</h1>
      <form>
        <div>
          <label>Pergunta 1: se amigo fica no celular por muitas horas?</label>
          <input type="text" />
        </div>
        <div>
          <label>Pergunta 2: Como você se sente com isso?</label>
          <input type="text" />
        </div>
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
};

export default Questionario;
