json.extract! user, :id, :first_name, :last_name, :email, :address, :city, :zip-code, :company, :company_description, :created_at, :updated_at
json.url user_url(user, format: :json)
