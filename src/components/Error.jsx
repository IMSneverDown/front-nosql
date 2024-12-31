import styled from 'styled-components'

const ErrorWrapper=styled.div`
display:flex;
justify-content:center;
 align-content: center;
`

const ErrorContainer=styled.div`
  margin: 30px;
  padding: 60px 90px;
  display: flex;
  max-width: 1200px;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  gap:30px
`


function Error(){
    return(
    <ErrorWrapper>
        <ErrorContainer>
        <h3>oups...</h3>
        <h2>Il semblerait qu'il ait un problème</h2>
        </ErrorContainer>
    </ErrorWrapper>
    )
}

export default Error