class User < ApplicationRecord
  validates_presence_of :first_name, :last_name, :email, :address, :city, :company, :zip_code
  validates_uniqueness_of :email
end
