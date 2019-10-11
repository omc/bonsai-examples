# Ruby on Rails
This is a demo application for showing how to use the [elasticsearch-rails](https://github.com/elastic/elasticsearch-rails) gem. This app uses a scaffold, a Postgres database, and numerous gems.

## Getting Started
These instructions will get you a copy of the app up and running on your local machine for development and testing purposes

### Prerequisites
If you don't have Yarn installed already, run
```
yarn install --check-files
```

### Installing
Run the following commands
```
git clone git@github.com:omc/bonsai-examples.git
cd bonsai-examples
cd rails
bundle install
bundle update
```

### Set up a Postgres Database
Run the following commands to set up a local Postgres DB on your local machine and seed it with 100 randomized users
```
bundle exec rake db:{create,migrate}
bundle exec rake seed:users
```

### Start Rails app
Run
```
bundle exec rails s
```
Navigate to http://localhost:3000/ once the Rails server is up and running

[insert screenshot]

### Running tests
We like using Guard to automatically run the specs against files as they are changed. Open another terminal tab/window and run
```
bundle exec guard start
```

## Built With
- Ruby 2.5.3
- Rails 6.0.0

## Included Gems
- [rspec-rails](https://rubygems.org/gems/rspec-rails/versions/3.8.2)
- [launchy](https://rubygems.org/gems/launchy)
- [pry](https://rubygems.org/gems/pry)
- [factory_bot_rails](https://rubygems.org/gems/factory_bot_rails)
- ... Do we want this section?

## License
This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/omc/bonsai-examples/blob/master/LICENSE) file for details

## Acknowledgments
- The entire [OMC team](https://omc.io/#team)!
