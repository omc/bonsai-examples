# Ruby on Rails
This is a demo application for showing how to use the [elasticsearch-rails](https://github.com/elastic/elasticsearch-rails) gem. This app employs a scaffold, a Postgres database, and numerous gems.

## Getting Started
These instructions will get you a copy of the app up and running on your local machine for development and testing purposes.

### Installing
Run the following commands:
```
git clone git@github.com:omc/bonsai-examples.git
cd bonsai-examples
cd rails
bundle install
bundle update
```

If you don't have Yarn installed already, you may have to run:
```
yarn install --check-files
```

### Set up a Postgres Database
Run the following commands to set up a local Postgres DB on your local machine and seed it with 100 randomized users:
```
bundle exec rake db:{create,migrate}
bundle exec rake seed:users
```

### Start Rails app
Run:
```
bundle exec rails s
```
Navigate to http://localhost:3000/users once the Rails server is up and running.

### Running tests
We like using Guard to automatically run the specs against files as they are changed. Open another terminal tab/window and run:
```
bundle exec guard start
```

## License
This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/omc/bonsai-examples/blob/master/LICENSE) file for details.
