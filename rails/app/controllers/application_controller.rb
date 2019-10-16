# frozen_string_literal: true

class ApplicationController < ActionController::Base
  def search
    @results = Elasticsearch::Model.search(params[:q]).results
  end
end
