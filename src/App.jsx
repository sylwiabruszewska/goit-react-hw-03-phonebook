import { Component } from 'react';

import {
  Container,
  Section,
  ContactForm,
  ContactList,
  FilterInput,
} from './components/index';

import { nanoid } from 'nanoid';
import Notiflix from 'notiflix';

const CONTACTS_LOCAL_STORAGE_KEY = 'contacts';

export class App extends Component {
  // pobieranie danych z local storage
  constructor(props) {
    super(props);

    const storedContacts = localStorage.getItem(CONTACTS_LOCAL_STORAGE_KEY);

    if (!storedContacts) {
      localStorage.setItem(
        CONTACTS_LOCAL_STORAGE_KEY,
        JSON.stringify(this.state.contacts)
      );
    }
  }

  state = {
    contacts: [
      { id: 'id-1', name: 'Rosie Simpson', number: '459-12-56' },
      { id: 'id-2', name: 'Hermione Kline', number: '443-89-12' },
      { id: 'id-3', name: 'Eden Clements', number: '645-17-79' },
      { id: 'id-4', name: 'Annie Copeland', number: '227-91-26' },
    ],
    filter: '',
  };

  // aktualizacja danych w state na podstawie danych w local storage
  componentDidMount() {
    const storedContacts = localStorage.getItem(CONTACTS_LOCAL_STORAGE_KEY);
    if (storedContacts) {
      this.setState({ contacts: JSON.parse(storedContacts) });
    }
  }

  // aktualizacja danych w local storage przy update komponentu
  componentDidUpdate() {
    this.updateLocalStorage(this.state.contacts);
  }

  updateLocalStorage = contacts => {
    localStorage.setItem(CONTACTS_LOCAL_STORAGE_KEY, JSON.stringify(contacts));
  };

  addNewContact = event => {
    const form = event.target;
    const {
      name: { value: name },
      number: { value: number },
    } = form.elements;

    const existingContact = this.checkIfContactExists(name);

    if (!existingContact) {
      const newContact = {
        id: nanoid(),
        name,
        number,
      };

      this.setState(prevState => ({
        contacts: [...prevState.contacts, newContact],
      }));

      Notiflix.Notify.success('Contact added successfully');
      form.reset();
    } else {
      Notiflix.Notify.warning(`${name} is already in contacts`);
    }

    event.preventDefault();
  };

  checkIfContactExists(name) {
    const { contacts } = this.state;
    return contacts.find(
      contact => contact.name.toLowerCase() === name.toLowerCase()
    );
  }

  removeContact = id => {
    const removedContact = this.state.contacts.find(
      contact => contact.id === id
    );

    if (removedContact) {
      this.setState(state => ({
        contacts: state.contacts.filter(contact => contact.id !== id),
      }));

      Notiflix.Notify.success(`${removedContact.name} has been removed`);
    }
  };

  handleFilterChange = event => {
    this.setState({ filter: event.target.value });
  };

  render() {
    const { contacts, filter } = this.state;

    const filteredContacts = contacts.filter(contact =>
      contact.name.toLowerCase().includes(filter.toLowerCase())
    );

    return (
      <Container>
        <h1>Phonebook</h1>
        <ContactForm handler={this.addNewContact} />

        <Section title="Contacts">
          <FilterInput value={filter} onChange={this.handleFilterChange} />
          <ContactList
            contacts={filteredContacts}
            handleDelete={this.removeContact}
          />
        </Section>
      </Container>
    );
  }
}
