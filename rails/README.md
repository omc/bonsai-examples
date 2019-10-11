# Ruby on Rails
This is a demo application for showing how to use the [elasticsearch-rails](https://github.com/elastic/elasticsearch-rails) gem. This app uses a scaffold and Postgres DB.

## Getting Started
These instructions will get you a copy of the app up and running on your local machine for development and testing purposes

### Prerequisites
If you don't have Yarn installed already, run
```yarn install --check-files```

### Installing
In your Terminal, run
```
git clone git@github.com:omc/bonsai-examples.git
cd bonsai-examples
cd rails
bundle install
bundle update
bundle exec rake db:{create,migrate}
bundle exec rake seed:users
bundle exec rails s
```

### Set up the Postgres Database

### Running the tests
When you are writing code, you can have a terminal running bundle exec guard and it will give you a running update on ruby conventions and test coverage

## Built With
- Ruby 2.5.3
- Rails 6.0.0

## Included Gems
- [rspec-rails](https://rubygems.org/gems/rspec-rails/versions/3.8.2)
- [launchy](https://rubygems.org/gems/launchy)
- [pry](https://rubygems.org/gems/pry)
- [factory_bot_rails](https://rubygems.org/gems/factory_bot_rails)
- ...

## License
This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/omc/bonsai-examples/blob/master/LICENSE) file for details

## Acknowledgments
- The entire [OMC team](https://omc.io/#team)!
