# frozen_string_literal: true

class User < ActiveRecord::Base
  validates :first_name, :last_name, :email, :address, :city, :company,
            :zip_code, presence: true
  validates :email, uniqueness: true

  searchable do
    text :first_name
    text :last_name
    text :email
    text :address
    text :city
    integer :zip_code
    text :company
    text :company_description
  end
end
