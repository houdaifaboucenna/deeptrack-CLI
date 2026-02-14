#!/usr/bin/env node

import { Command } from 'commander';
import { initDb, addUser, getUsers, deleteUser } from './db.js';

const program = new Command();

program
  .name('cli')
  .description('Minimal CLI with SQLite')
  .version('1.0.0');

program
  .command('init')
  .description('Initialize database')
  .action(() => {
    initDb();
    console.log('✓ Database initialized');
  });

program
  .command('add <name> <email>')
  .description('Add a user')
  .action((name, email) => {
    const id = addUser(name, email);
    console.log(`✓ User added with ID: ${id}`);
  });

program
  .command('list')
  .description('List all users')
  .action(() => {
    const users = getUsers();
    if (users.length === 0) {
      console.log('No users found');
      return;
    }
    console.table(users);
  });

program
  .command('delete <id>')
  .description('Delete a user by ID')
  .action((id) => {
    deleteUser(Number(id));
    console.log(`✓ User ${id} deleted`);
  });

program.parse(process.argv);
