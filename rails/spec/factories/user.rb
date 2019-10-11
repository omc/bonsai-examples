# frozen_string_literal: true

FactoryBot.define do
  factory :user do
    sequence(:first_name) { |n| "Sam#{n}" }
    sequence(:last_name) { |n| "Smith#{n}" }
    sequence(:email) { |n| "samsmith#{n}@gmail.com" }
    address { '123 Happy St' }
    city { 'Denver' }
    zip_code { 80_015 }
    company { |n| "Smith&Co#{n}" }
    company_description { |n| "Smith&Co#{n} dry goods" }
  end
end
