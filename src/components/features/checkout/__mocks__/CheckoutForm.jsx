import React from 'react';

const CheckoutForm = ({ onSubmit }) => (
    <button
        data-testid="mock-submit"
        onClick={() => onSubmit({
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            address: '123 St',
            city: 'NY',
            zip: '10001'
        })}
    >
        Submit Order
    </button>
);

export default CheckoutForm;
