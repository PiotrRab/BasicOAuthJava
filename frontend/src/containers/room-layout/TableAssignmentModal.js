import React, { useEffect, useState } from 'react';
import Modal from "../../components/layouts/modal/Modal";
import ModalHeader from "../../components/layouts/modal/modalHeader/ModalHeader";
import ModalBody from "../../components/layouts/modal/modalBody/ModalBody";
import ModalFooter from "../../components/layouts/modal/modalFooter/ModalFooter";
import Button from "../../components/elements/common/button/Button";
import { GET, PUT } from "../../appConfig/Endpoint";
import './room-layout.scss'; // Używamy tych samych stylów co główny kontener

const TableAssignmentModal = ({ table, onClose }) => {
    const [allGuests, setAllGuests] = useState([]);
    const [assignedGuests, setAssignedGuests] = useState([]);

    useEffect(() => {
        // Pobierz wszystkich gości użytkownika
        GET('/guests', null, {}, (data) => {
            setAllGuests(data);
            // Wyfiltruj tych, którzy są już przypisani do TEGO stołu
            setAssignedGuests(data.filter(g => g.tableId === table.id));
        });
    }, [table.id]);

    const handleAssign = (guest) => {
        const updatedGuest = { ...guest, tableId: table.id };
        PUT('/guests', guest.id, updatedGuest, () => {
            setAssignedGuests([...assignedGuests, updatedGuest]);
            setAllGuests(allGuests.map(g => g.id === guest.id ? updatedGuest : g));
        });
    };

    const handleUnassign = (guest) => {
        const updatedGuest = { ...guest, tableId: null };
        PUT('/guests', guest.id, updatedGuest, () => {
            setAssignedGuests(assignedGuests.filter(g => g.id !== guest.id));
            setAllGuests(allGuests.map(g => g.id === guest.id ? updatedGuest : g));
        });
    };

    return (
        <Modal>
            <ModalHeader 
                title={`Zarządzaj stołem: ${table.name}`} 
                subtitle={`Miejsca: ${assignedGuests.length} / ${table.capacity}`} 
            />
            <ModalBody>
                <div className="assignment-container">
                    {/* Kolumna z dostępnymi gośćmi */}
                    <div className="guest-list-column">
                        <h4>Dostępni Goście</h4>
                        <div className="scroll-area">
                            {allGuests.filter(g => !g.tableId).length === 0 && (
                                <p style={{ textAlign: 'center', padding: '20px', color: '#999', fontSize: '0.9rem' }}>Brak wolnych gości</p>
                            )}
                            {allGuests.filter(g => !g.tableId).map(guest => (
                                <div key={guest.id} className="guest-item">
                                    <span className="guest-name">{guest.firstName} {guest.lastName}</span>
                                    <Button onClick={() => handleAssign(guest)} className="add">Dodaj</Button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Kolumna z gośćmi przypisanymi do stołu */}
                    <div className="guest-list-column">
                        <h4>Siedzą przy stole</h4>
                        <div className="scroll-area">
                            {assignedGuests.length === 0 && (
                                <p style={{ textAlign: 'center', padding: '20px', color: '#999', fontSize: '0.9rem' }}>Stół jest pusty</p>
                            )}
                            {assignedGuests.map(guest => (
                                <div key={guest.id} className="guest-item">
                                    <span className="guest-name">{guest.firstName} {guest.lastName}</span>
                                    <Button onClick={() => handleUnassign(guest)} className="delete">Usuń</Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button onClick={onClose} className="save">Gotowe</Button>
            </ModalFooter>
        </Modal>
    );
};

export default TableAssignmentModal;
