import { useEffect, useState } from 'react'
import { tenures } from './utils/constants'
import './App.css'

function App() {
  const [cost,setCost] = useState(0)
  const [interest,setInterest] = useState(10)
  const [downPayment,setDownPayment] = useState(0)
  const [fee,setFee] = useState(1)
  const [tenure,setTenure] = useState(12)
  const [emi,setEmi] = useState(0)


  const calculateEMI = (downpayment) => {
    //EMI AMOUNT = [p * R * (1+ R)^N]/[(1+R)^N-1]
    if(!cost) return;

    const loanAmount = cost - downpayment
    const rateOfInterest = interest /100;
    const numOfYears = tenure /12;

    const EMI = (loanAmount * rateOfInterest*(1+rateOfInterest)**numOfYears) / ((1+rateOfInterest)**numOfYears-1)
    return Number(EMI/12).toFixed(0)
  }

  const calculateDp = () => {
    if(!cost) return;
    const downPaymentPercent = 100 - (emi/calculateEMI(0)) * 100;
    return Number((downPaymentPercent/100)*cost).toFixed(0);
  }
   
  useEffect(()=>{
    if(!cost > 0){
      setDownPayment(0);
      setEmi(0)
    }


    const emi = calculateEMI(downPayment);
    setEmi(emi)
  },[tenure])

  const updateEMI = (e) =>{
    if(!cost) return;
    const dp = Number(e.target.value)
    setDownPayment(dp.toFixed(0))

    //calculate EMI and update it
    const emi = calculateEMI(dp)
    setEmi(emi)
  }

  const updateDownPayment = (e) => {
    if(!cost) return;
    const emi = Number(e.target.value)
    setEmi(emi.toFixed(0))
    // calculate downpayment and update 
    const dp = calculateDp(emi)
    setDownPayment(dp);
  }
  

  return (
    <div className='container'>
      <h1 className='title'>EMI CALCULATOR</h1>

      <span className='title'>Total Cost of an Asset</span>
      <input type="number" value = {cost} onChange = {(e)=>{
        setCost(e.target.value)
      }} placeholder='Total cost of assest' />
      
      <span className='title'>Interest Rate in (%)</span>
      <input id="interest" type="number" value = {interest} onChange = {(e)=>{
        setInterest(e.target.value)
      }} placeholder='Interest Rate' />


     <span className='title'>Processing fee in (%)</span>
      <input type="number" value = {fee} onChange = {(e)=>{
        setFee(e.target.value)
      }} placeholder='Processing fee' />



     <span className='title'>Down Payment</span>
     <span className='title' style={{textDecoration:"underline"}}>
      Total Down Payment - {(Number(downPayment)+(cost - downPayment)*(fee/100)).toFixed(0)}
     </span>
     <div>
      <input type="range" 
      min={0} 
      max={cost}
      className='slider' 
      value={downPayment}
       onChange={updateEMI}
       />

       <div className='labels'>
        <label>0%</label>
        <b>{downPayment}</b>
        <label htmlFor="">100%</label>
       </div>
     </div>
     <span className='title'>Loan Per Month</span>
     <span className='title' style={{textDecoration:"underline"}}>
      Total Loan Amount -{ (emi * tenure).toFixed(0)}
     </span>
     <div>
      <input type="range" 
      min={calculateEMI(cost)} 
      max={calculateEMI(0)}
      className='slider' 
      value={emi}
      onChange={updateDownPayment}
      />
      <div className='labels'>
        <label>{calculateEMI(cost)}</label>
        <b>{emi}</b>
        <label htmlFor="">{calculateEMI(cost)}</label>
       </div>
     </div>
     <span className='title'>Tenure</span>
     <div className='tenure__container'>
      {
        tenures.map((t) =>{
         return (<button onClick={()=>{
          setTenure(t)
         }} className={`tenure ${t === tenure ? "selected":""}`}>{t}</button>)
        })
      }
</div>
    </div>
  )
}

export default App
