import React, {useState, useEffect} from 'react'
import Header from './Header'
import ContactList from './ContactList'
import ContactCard from './ContactCard'
import AddContact from './AddContact'
import {uuid} from "uuidv4"
import{BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import ContactDetails from './ContactDetails'
import api from "../api/contacts"
import EditContact from './EditContact'

function App() {
  // const LOCAL_STORAGE_KEY = "contacts"
  const [ contacts, setContacts] = useState([]);
// retrieve api
const retrieveContacts = async () => {
  const response = await api.get("/contacts");
  return response.data;
};


  const addContactHandler = async (contact)=>{
    console.log(contact)
    const request = {
      id:uuid(),
      ...contact
    }
    const response = await api.post("/contacts", request)
    setContacts([...contacts, response.data])
  }
  const removeContactHandler = async (id) => {
    await api.delete(`/contacts/${id}`);
    const newContactList = contacts.filter((contact)=>{
      return contact.id !== id;

    });
    setContacts(newContactList);
  }
  const updateContactHandler = async (contact)=>{
    const response = await api.put(`/contacts/${contact.id}`, contact);
    // console.log("hello",response.data)
    const {id, name, email} = response.data;
    setContacts(contacts.map(contact=>{
      return contact.id === id ? {...response.data} : contact;
    }))
    
  }
  useEffect(()=>{
    // const retrieveContacts = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY))
    // if(retrieveContacts) setContacts(retrieveContacts)
    const getAllContacts = async () => {
      const allContacts = await retrieveContacts();
      if(allContacts) setContacts(allContacts);
    }
    getAllContacts();
  },[])
  useEffect(()=>{
    //localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(contacts))
  },[contacts])
  return (
   <div className="ui container">
     <Router>
     <Header/>
     <Switch>
        <Route path="/add" render={(...props)=>(
          <AddContact {...props} 
          addContactHandler={addContactHandler} />
        )}/>
        

        <Route path="/" exact 
        render={(props)=> (
        <ContactList 
        {...props} 
        contacts={contacts} 
        getContactId={removeContactHandler}
        />
        )
        }
        />

        <Route
        path="/contact/:id"
        component={ContactDetails}
        />
      <Route path="/edit" render={(...props)=>(
          <EditContact {...props} 
          updateContactHandler={updateContactHandler} />
        )}/>
     </Switch>

     {/* <AddContact addContactHandler={addContactHandler}/> */}
     {/* <ContactList contacts={contacts} getContactId={removeContactHandler}/> */}
     </Router>
   </div>
  );
}

export default App;
