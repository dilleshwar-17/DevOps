pipeline {
    agent {
        label 'docker',
    }
    
    options {
        timeout(time: 30, unit: 'MINUTES')
    }
    
    triggers {
        githubPush()
    }
    
    environment {
        IMAGE_TAG = "tevra-website:${BUILD_NUMBER}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                script {
                    if (fileExists('package.json')) {
                        sh 'npm install'
                        env.NPM_INSTALLED = 'true'
                    } else {
                        env.NPM_INSTALLED = 'false'
                    }
                }
            }
        }
        
        stage('Build') {
            steps {
                echo 'Building the application...'
                script {
                    if (env.NPM_INSTALLED == 'true') {
                        sh 'npm run build'
                    }
                }
                sh "docker build -t ${IMAGE_TAG} ."
            }
        }
        
        stage('Test') {
            steps {
                echo 'Running tests...'
                script {
                    if (env.NPM_INSTALLED == 'true') {
                        sh 'npm test'
                    }
                    // Test nginx configuration
                    def testResult = sh(script: "docker run --rm ${IMAGE_TAG} nginx -t", returnStatus: true)
                    if (testResult != 0) {
                        error('Nginx configuration test failed')
                    }
                }
            }
        }
        
        stage('Deploy') {
            steps {
                echo 'Deploying application...'
                script {
                    // Stop existing containers gracefully
                    sh 'docker-compose down || true'
                    
                    // Deploy new version
                    sh 'docker-compose up -d'
                    
                    // Verify deployment
                    sleep(time: 10, unit: 'SECONDS')
                    def runningContainers = sh(script: 'docker-compose ps -q | wc -l', returnStdout: true).trim()
                    def healthyContainers = sh(script: 'docker-compose ps -q | xargs docker inspect --format="{{.State.Status}}" | grep running | wc -l', returnStdout: true).trim()
                    if (runningContainers != healthyContainers) {
                        error("Deployment verification failed - ${healthyContainers}/${runningContainers} containers running")
                    }
                }
            }
        }
    }
    
    post {
        always {
            sh 'docker system prune -f || true'
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}