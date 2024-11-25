import React, { useState, useEffect } from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '../app/page';

// Mocking global fetch
beforeAll(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve([]),
    })
  );
});

describe('Home', () => {
  it('renders the main heading', () => {
    render(<Home />);
    const heading = screen.getByRole('heading', { level: 1, name: /Ferry Ticketing System/i });
    expect(heading).toBeInTheDocument();
  });

  it('renders the Login and Register components if user is not logged in', () => {
    render(<Home />);
    const loginButton = screen.getByRole('button', { name: /sign in/i });
    const registerButton = screen.getByRole('button', { name: /register/i });
    expect(loginButton).toBeInTheDocument();
    expect(registerButton).toBeInTheDocument();
  });

  it('renders the AdminDashboard if user role is admin', async () => {
    const mockUser = { role: 'admin', userId: '123' };
    jest.spyOn(React, 'useState').mockReturnValueOnce([mockUser, jest.fn()]);

    await act(async () => {
      render(<Home />);
    });

    const adminDashboard = screen.getByText(/admin dashboard/i);
    expect(adminDashboard).toBeInTheDocument();
  });

  it('renders the PassengerDashboard if user role is passenger', async () => {
    const mockUser = { role: 'passenger', name: 'John Doe' };
    jest.spyOn(React, 'useState').mockReturnValueOnce([mockUser, jest.fn()]);
  
    // Mocking the fetch response for ferries
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve([
            { _id: '1', name: 'Ferry 1', route: 'Route 1', time: '10:00 AM', availableSeats: 10 },
          ]),
      })
    );
  
    await act(async () => {
      render(<Home />);
    });
  
    // Check if the "Ferry Schedules" heading is rendered
    const ferrySchedulesHeading = await screen.findByText(/Ferry Schedules/i);
    expect(ferrySchedulesHeading).toBeInTheDocument();
  
    // Check if a ferry name is rendered
    const ferryName = await screen.findByText(/Ferry 1/i);
    expect(ferryName).toBeInTheDocument();
  
    // Check if the "Select" button for the ferry is present
    const selectButton = screen.getByRole('button', { name: /select/i });
    expect(selectButton).toBeInTheDocument();
  });
});
