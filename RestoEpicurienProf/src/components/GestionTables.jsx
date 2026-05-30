import React, { useState } from 'react';


function GestionTables(){
    const[formData,setFormData] =useState({
        id_table: '',
        numero_table: '',
        capacite: '',
        zone: '',
    });

    const [message, setMessage] = useState('');

    const handlChange = (e)=>{
        const{name,value} = e.target;
        setFormaData({
            ...formData,
            [name]:value
        });
    };

    const handleSubmit =(e) => {
        e.preventDefault();
        console.log('Données du formulaire:', formData);
    };

}

export default GestionTables ;

//id_table	numero_table	capacite	zone	 