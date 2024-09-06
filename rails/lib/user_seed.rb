# frozen_string_literal: true

require 'faker'

class UserSeed
  def self.seed
    100.times do |_user|
      User.create!(first_name:          Faker::Name.first_name,
                   last_name:           Faker::Name.last_name,
                   address:             Faker::Address.street_address,
                   zip_code:            Faker::Address.zip_code,
                   email:               Faker::Internet.unique.email,
                   city:                Faker::Address.city,
                   company:             Faker::Company.name,
                   company_description: Faker::Company.catch_phrase)
    end
  end
end
