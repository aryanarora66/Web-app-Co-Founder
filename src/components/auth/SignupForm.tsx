"use client";

import { useState, useEffect } from "react";

interface SignupFormProps {
  onSuccess: () => void;
}

export default function SignupForm({ onSuccess }: SignupFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Info
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    role: "founder",
    
    // Profile Info
    bio: "",
    website: "",
    location: "",
    instagramUrl: "",
    
    // Skills
    skills: [] as Array<{skill: string, level: string}>,
    lookingFor: [] as string[],
    
    // Social Links
    socialLinks: [] as Array<{platform: string, url: string}>,
  });

  const [newSkill, setNewSkill] = useState({ skill: "", level: "Beginner" });
  const [newLookingFor, setNewLookingFor] = useState("");
  const [newSocialLink, setNewSocialLink] = useState({ platform: "", url: "" });
  
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (formData.username.length > 2) {
      const checkUsername = async () => {
        try {
          const res = await fetch(`/api/auth/check-username?username=${formData.username}`);
          const data = await res.json();
          setUsernameAvailable(data.available);
        } catch (err) {
          console.error("Error checking username availability:", err);
        }
      };
      checkUsername();
    } else {
      setUsernameAvailable(null);
    }
  }, [formData.username]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addSkill = () => {
    if (newSkill.skill.trim()) {
      setFormData({
        ...formData,
        skills: [...formData.skills, { ...newSkill }]
      });
      setNewSkill({ skill: "", level: "Beginner" });
    }
  };

  const removeSkill = (index: number) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((_, i) => i !== index)
    });
  };

  const addLookingFor = () => {
    if (newLookingFor.trim()) {
      setFormData({
        ...formData,
        lookingFor: [...formData.lookingFor, newLookingFor.trim()]
      });
      setNewLookingFor("");
    }
  };

  const removeLookingFor = (index: number) => {
    setFormData({
      ...formData,
      lookingFor: formData.lookingFor.filter((_, i) => i !== index)
    });
  };

  const addSocialLink = () => {
    if (newSocialLink.platform.trim() && newSocialLink.url.trim()) {
      setFormData({
        ...formData,
        socialLinks: [...formData.socialLinks, { ...newSocialLink }]
      });
      setNewSocialLink({ platform: "", url: "" });
    }
  };

  const removeSocialLink = (index: number) => {
    setFormData({
      ...formData,
      socialLinks: formData.socialLinks.filter((_, i) => i !== index)
    });
  };

  const nextStep = () => {
    if (step === 1) {
      // Validate basic info
      if (!formData.name || !formData.email || !formData.username || !formData.password || !formData.role) {
        setError("Please fill in all required fields");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      if (usernameAvailable === false) {
        setError("Username is not available");
        return;
      }
    }
    setError("");
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Signup failed");
      onSuccess();
    } catch (err: unknown) {
      console.error("Signup error:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Progress Indicator */}
      <div className="flex items-center justify-center mb-6">
        <div className="flex space-x-2">
          {[1, 2, 3].map((num) => (
            <div
              key={num}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                num === step
                  ? 'bg-blue-600 text-white'
                  : num < step
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {num < step ? '✓' : num}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Basic Information */}
      {step === 1 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 text-center mb-4">Basic Information</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username *</label>
            <input
              type="text"
              name="username"
              required
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800"
            />
            {usernameAvailable !== null && (
              <p className={`mt-1 text-sm ${usernameAvailable ? "text-green-600" : "text-red-600"}`}>
                {usernameAvailable ? "Username available" : "Username taken"}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800"
            >
              <option value="founder">Founder</option>
              <option value="cofounder">Co-Founder</option>
              <option value="developer">Developer</option>
              <option value="designer">Designer</option>
              <option value="marketer">Marketer</option>
              <option value="investor">Investor</option>
              <option value="advisor">Advisor</option>
              <option value="product">Product Manager</option>
              <option value="operations">Operations</option>
              <option value="sales">Sales</option>
              <option value="finance">Finance</option>
              <option value="customer_success">Customer Success</option>
              <option value="data_scientist">Data Scientist</option>
              <option value="growth_hacker">Growth Hacker</option>
              <option value="legal">Legal</option>
            </select>
          </div>

          <button
            type="button"
            onClick={nextStep}
            className="w-full py-2 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Next: Profile Details
          </button>
        </div>
      )}

      {/* Step 2: Profile Details */}
      {step === 2 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 text-center mb-4">Profile Details</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800"
              placeholder="Tell us about yourself..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                placeholder="https://yourwebsite.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                placeholder="City, Country"
              />
            </div>
          </div>

          {/* Skills Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
            <div className="space-y-2">
              {formData.skills.map((skill, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                  <span className="flex-1">{skill.skill} - {skill.level}</span>
                  <button
                    type="button"
                    onClick={() => removeSkill(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkill.skill}
                  onChange={(e) => setNewSkill({ ...newSkill, skill: e.target.value })}
                  placeholder="Skill name"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                />
                <select
                  value={newSkill.level}
                  onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
                <button
                  type="button"
                  onClick={addSkill}
                  className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Looking For Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Looking For</label>
            <div className="space-y-2">
              {formData.lookingFor.map((item, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                  <span className="flex-1">{item}</span>
                  <button
                    type="button"
                    onClick={() => removeLookingFor(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newLookingFor}
                  onChange={(e) => setNewLookingFor(e.target.value)}
                  placeholder="What are you looking for?"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                />
                <button
                  type="button"
                  onClick={addLookingFor}
                  className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={prevStep}
              className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              type="button"
              onClick={nextStep}
              className="flex-1 py-2 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Next: Social Links
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Social Links */}
      {step === 3 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 text-center mb-4">Social Links (Optional)</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
            <input
              type="url"
              name="instagramUrl"
              value={formData.instagramUrl}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800"
              placeholder="https://instagram.com/username"
            />
          </div>

          {/* Social Links Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Other Social Links</label>
            <div className="space-y-2">
              {formData.socialLinks.map((link, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                  <span className="flex-1">{link.platform}: {link.url}</span>
                  <button
                    type="button"
                    onClick={() => removeSocialLink(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSocialLink.platform}
                  onChange={(e) => setNewSocialLink({ ...newSocialLink, platform: e.target.value })}
                  placeholder="Platform (e.g., GitHub)"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                />
                <input
                  type="url"
                  value={newSocialLink.url}
                  onChange={(e) => setNewSocialLink({ ...newSocialLink, url: e.target.value })}
                  placeholder="URL"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                />
                <button
                  type="button"
                  onClick={addSocialLink}
                  className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={prevStep}
              className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading || usernameAvailable === false}
              className="flex-1 py-2 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-70"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </div>
        </div>
      )}
    </form>
  );
}