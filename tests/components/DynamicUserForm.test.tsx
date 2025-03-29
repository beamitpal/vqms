import { render } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import DynamicUserForm from '../../src/components/user/form'; // Adjust path
import { createUserFromForm } from '../../src/actions/users/business'; // Adjust path

jest.mock('../../src/actions/users/business', () => ({
  createUserFromForm: jest.fn(),
}));

describe('DynamicUserForm Component', () => {
  const mockProps = {
    projectId: 'proj1',
    customFields: {
      name: { type: 'text', defaultValue: '' },
      email: { type: 'text', defaultValue: '' },
    },
    toLink: 'testslug',
  };

  it('renders form fields based on customFields', () => {
    render(<DynamicUserForm {...mockProps} />);
    
    const { getByLabelText } = render(<DynamicUserForm {...mockProps} />);
    expect(getByLabelText(/name/i)).toBeInTheDocument();
    expect(getByLabelText(/email/i)).toBeInTheDocument();
  });

  it('submits form data correctly', async () => {
    (createUserFromForm as jest.Mock).mockResolvedValue({ success: true });
    
    render(<DynamicUserForm {...mockProps} />);
    const { getByLabelText, getByRole } = render(<DynamicUserForm {...mockProps} />);
    fireEvent.change(getByLabelText(/name/i), { target: { value: 'John' } });
    fireEvent.change(getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    fireEvent.click(getByRole('button', { name: /submit/i }));
    fireEvent.click(getByRole('button', { name: /submit/i }));

    expect(createUserFromForm).toHaveBeenCalledWith('proj1', {
      name: 'John',
      email: 'john@example.com',
    });
  });
});