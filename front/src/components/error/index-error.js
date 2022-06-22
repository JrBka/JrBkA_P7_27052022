import styled from "styled-components";

function Error() {
  const Div = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
  `;

  const H1 = styled.h1`
    font-size: 50px;
  `;

  const P = styled.p`
    font-size: 30px;
  `;
  return (
    <Div>
      <H1>Erreur 404 !</H1>
      <P>Cette Page n'existe pas</P>
    </Div>
  );
}

export default Error;
