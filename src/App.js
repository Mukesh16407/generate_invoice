import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from  'jspdf-autotable'
import "./App.css";

function App() {
  const[billTotal,setBillTotal]=useState(0)
  const [item, setItem] = useState([
    {
      itemName: "",
      quantity: "",
      amount: "",
      total: 0,
    },
  ]);

  const handleChange = (index,e) => {
     
    //Storing current item value in a array object 
    let data = [...item];
   
    //Getting the changed input box name and their corresponding value
     data[index][e.target.name] = e.target.value;
    //Calculating the total value accordingly 
    data[index]['total']=(data[index]['quantity']*data[index]['amount']).toFixed(2)
     //Setting the new value accordingly
     setItem(data)
  };
  function addItem()
  {
    const newItem={itemName:"",quantity:"",amount:"",total:0};

    setItem((oldValue) => {
     
      const newArray=[]
      for(let i=0;i<oldValue.length;i++)
      {
        
        newArray.push(oldValue[i])
      }
     
      newArray.push(newItem)
      return newArray
    })
  }
  function removeEntry(index)
  {
    //Storing old items value in a variable
    let data=[...item]
    //Removing the array object with index value form the stored variable
    data.splice(index,1)
    //Storing it into the state
    setItem(data)
  }
  useEffect(()=>{
    //Setting total bill amount
    setBillTotal(()=>{
      //Getting copy of all item with its corresponding total
      let data = [...item];
      //Initializing temporary variable
      let temp=0;
      //Parsing through each item to calculate bill total based on each item total amount
      for(let i=0;i<data.length;i++)
      {
        temp= parseFloat(data[i].total) + temp;
      }
      return temp.toFixed(2)
    })
  },[item]);

  function handleSubmit(event) {
    //Preventing the input field to get erased
    event.preventDefault();
     //Intializing jspdf 
     const doc = new jsPDF()
     let newArray = [];

     //Converting array object into array to make PDF conversion easy;
     for(let i=0;i<item.length;i++){
      newArray.push([i+1,item[i].itemName,item[i].quantity,item[i].amount,item[i].total])
    }

     //Name of Shop in text
     doc.text("MAA LAXMI Shop", 70,20);
     //Calculating today date to display in PDF;
     let today = new Date();
     let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    today = dd + '/' + mm + '/' + yyyy;

    //Displaying today's date
    doc.text(`Date: ${today}`, 200, 25, null, null, "right");
    doc.text(`Customer name: Mukesh`, 200, 30, null, null, "right");
    //Adding table heading along with its array of values

    autoTable(doc, {
      head: [['S.no','Item name', 'Quantity','Amount','Total']],
      body: newArray,
      startY: 35,
    })
    //Adding total billing amount in the end of table
    let finalY = doc.previousAutoTable.finalY;
    doc.text(`Total amount to be paid: ${billTotal}`, 12, finalY + 10);
    //saving bill in the name of 
    doc.save('Bill.pdf')
   
  }
  return (
    <form action="" onSubmit={handleSubmit}>
      <div className="App">
        {item.map((input,index)=>(
                <div  key={index}>
                <input
                  value={input.itemName}
                  onChange={event => handleChange(index,event)}
                  name="itemName"
                  placeholder="name.."
                />
                <input
                  value={input.quantity}
                  onChange={event => handleChange(index,event)}
                  name="quantity"
                  type="number"
                  pattern="[0-9]*"
                  step=".001"
                  min=".000"
                  max="999.999"
                  placeholder="quantity.."
                />
                <input
                  value={input.amount}
                  onChange={event => handleChange(index,event)}
                  name="amount"
                  type="number"
                  pattern="[0-9]*"
                  step=".01"
                  min=".01"
                  max="99999.99"
                  placeholder="amount.."
                />
                <input
                  value={input.total}
                  name="total"
                  placeholder="total.."
                  readOnly
                />
                <button key={index} onClick={() => removeEntry(index)}>Remove</button>
              </div>
        ))}
        
        <button type="button" onClick={addItem}>Add+</button>
        <h3>Total amount:{billTotal ? billTotal : 0}</h3>
        <button type="submit">submit</button>
      </div>
    </form>
  );
}

export default App;
