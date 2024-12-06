import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import '../index.css'; // Importez les styles globaux si nécessaires.

export default {
  title: 'Components/Navigation',
  component: Navigation,
  decorators: [
    (Story) => (
      <Router>
        <Story />
      </Router>
    ),
  ],
};

const Template = (args) => <Navigation {...args} />;

export const Default = Template.bind({});
Default.args = {};
