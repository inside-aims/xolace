import styled from "styled-components"

export const TourWrapper = styled.div`
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  max-width: 300px;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  animation: fadeIn 0.5s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`

export const TourTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: #61dafb;
`

export const TourContent = styled.p`
  font-size: 0.9rem;
  line-height: 1.4;
  margin-bottom: 15px;
`

export const TourNavigation = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const TourButton = styled.button`
  background: #61dafb;
  color: #282c34;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #4fa8d5;
    transform: translateY(-2px);
  }
`

export const TourProgress = styled.div`
  font-size: 0.8rem;
  color: #bbb;
`

export const TourHighlight = styled.div`
  position: absolute;
  border: 2px solid #61dafb;
  border-radius: 4px;
  animation: pulse 2s infinite;

  @keyframes pulse {
    0% { box-shadow: 0 0 0 0 rgba(97, 218, 251, 0.4); }
    70% { box-shadow: 0 0 0 10px rgba(97, 218, 251, 0); }
    100% { box-shadow: 0 0 0 0 rgba(97, 218, 251, 0); }
  }
`

